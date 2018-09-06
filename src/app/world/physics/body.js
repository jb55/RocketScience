import {Terrain} from "../terrain/terrain";
import {getb2Vec2, box2d} from "./internal/box2d";
import {createCircleShape} from "./internal/shapes/circle";
import {BodyDefinition} from "./internal/bodyDefinition";
import * as Myr from "../../../lib/myr";
import {WheelJoint} from "./joints/wheelJoint";
import {Channels} from "./channels";
import {Fixture} from "./internal/fixture";

// Only instantiate bodies through Physics!
export function Body(physics, world, shapes, x, y, xOrigin, yOrigin, transform) {
    const _bodyDefinition = new BodyDefinition();
    const _body = world.CreateBody(_bodyDefinition.getDefinition());
    const _connected = [];

    const updateTransform = () => {
        transform.identity();
        transform.translate(
            _body.GetPosition().get_x() * Terrain.PIXELS_PER_METER,
            _body.GetPosition().get_y() * Terrain.PIXELS_PER_METER);
        transform.rotate(-_body.GetAngle());
        transform.translate(
            -xOrigin * Terrain.PIXELS_PER_METER,
            -yOrigin * Terrain.PIXELS_PER_METER);
    };

    /**
     * Update the body state.
     */
    this.update = () => {
        for (const connected of _connected)
            connected.update();

        updateTransform();
    };

    /**
     * Free this body
     */
    this.free = () => {
        for (const connected of _connected)
            connected.free();

        world.DestroyBody(_body);
    };

    /**
     * Create a wheel on this body.
     * @param {Number} radius The wheel radius in meters.
     * @param {Number} xOffset The wheel X offset in meters.
     * @param {Number} yOffset The wheel Y offset in meters.
     * @param {Myr.Transform} transform A transformation to capture this object's position.
     * @returns {WheelJoint} A new body representing the wheel.
     */
    this.createWheel = (radius, xOffset, yOffset, transform) => {
        const offset = new Myr.Vector(xOffset - xOrigin, yOffset - yOrigin);
        const body = new Body(
            physics,
            world,
            [createCircleShape(radius)],
            x + offset.x,
            y + offset.y,
            radius,
            radius,
            transform);

        _connected.push(body);

        return new WheelJoint(world, this, body, offset, new Myr.Vector(0, 0));
    };

    /**
     * Create a touch sensor on this body.
     * @param {Number} xOffset The wheel X offset in meters.
     * @param {Number} yOffset The wheel Y offset in meters.
     * @param {Number} direction The direction this sensor is pointing towards in radians.
     * @returns [Object} A sensor.
     */
    this.createTouchSensor = (xOffset, yOffset, direction) => {
        const offset = new Myr.Vector(xOffset - xOrigin, yOffset - yOrigin);


    };

    this._getBody = () => _body;

    for (const shape of shapes) {
        const fixture = new Fixture(shape, Channels.OBJECT, Channels.OBJECT);

        _body.CreateFixture(fixture.getDefinition());
        fixture.free();

        box2d.destroy(shape);
    }

    _bodyDefinition.free();
    _body.SetTransform(getb2Vec2(x, y), 0);
}