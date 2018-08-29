import * as Myr from "../../../lib/myr";

/**
 * A point on a pcb which may contain (part of) a component.
 * @constructor
 */
export function PcbPoint() {
    this.part = null;
    this.paths = 0;
}

/**
 * Sets whether this point is a connection to a pin.
 * @param {Boolean} connection A boolean which is true if this point is a connection.
 */
PcbPoint.prototype.setConnection = function(connection) {
    if (connection)
        this.paths |= 256;
    else
        this.paths &= ~256;
};

/**
 * Etch a path in a direction onto this point.
 * @param {Number} direction A direction in the range [0, 7].
 */
PcbPoint.prototype.etchDirection = function(direction) {
    this.paths |= 1 << direction;
};

/**
 * Remove an etched path in a direction from this point.
 * @param {Number} direction A direction in the range [0, 7].
 */
PcbPoint.prototype.clearDirection = function(direction) {
    this.paths &= ~(1 << direction);
};

/**
 * Check whether the paths on this point form a junction or terminal.
 * @returns {Boolean} A boolean indicating whether this point is a junction or terminal.
 */
PcbPoint.prototype.isJunction = function() {
    if ((this.paths & 256) === 256)
        return true;

    let count = 0;

    for (let bit = 0; bit < 8; ++bit) {
        count += (this.paths >> bit) & 1;

        if (count > 2)
            return true;
    }

    return count < 2;
};

/**
 * Check whether a certain direction has been etched onto this point.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Boolean} A boolean which is true when the given direction is etched onto this point.
 */
PcbPoint.prototype.hasDirection = function(direction) {
    return ((this.paths >> direction) & 1) === 1;
};

/**
 * Check whether this point has paths etched into it.
 * @returns {Boolean} A boolean which is True if this point has paths etched into it.
 */
PcbPoint.prototype.hasPaths = function() {
    return (this.paths & 0xFF) !== 0;
};

/**
 * Combine this points paths with another points paths.
 * @param {PcbPoint} point A PCB point.
 */
PcbPoint.prototype.flatten = function(point) {
    this.paths |= point.paths;
};

/**
 * Check whether this point's paths overlap another point's paths.
 * @param {PcbPoint} point A PCB point.
 * @returns {Boolean} A boolean which indicates whether the points have overlapping paths.
 */
PcbPoint.prototype.pathOverlaps = function(point) {
    return ((this.paths & point.paths) & 0xFF) !==0;
};

/**
 * Check whether this point's path equals another point's paths.
 * @param {PcbPoint} point A PCB point.
 * @returns {Boolean} A boolean which indicates whether the points have equal paths.
 */
PcbPoint.prototype.pathEquals = function(point) {
    return ((this.paths & point.paths) & 0xFF) === (point.paths & 0xFF);
};

/**
 * Erase this points connections overlapping with another points connections.
 * @param {PcbPoint} point A point to erase overlapping paths from.
 */
PcbPoint.prototype.erase = function(point) {
    this.paths &= ~point.paths;
};

/**
 * Execute a function for all connected points.
 * @param {Function} f A function taking an x and y coordinate of a connected point and the direction it came from.
 * @param {Number} [exclude] An optional direction to exclude from executing.
 */
PcbPoint.prototype.withConnected = function(f, exclude) {
    for (let direction = 0; direction < 8; ++direction) {
        if (exclude && exclude === direction)
            continue;

        const bit = 1 << direction;

        if ((this.paths & bit) === bit) {
            const delta = PcbPoint.directionToDelta(direction);

            f(delta.x, delta.y, (direction + 4) % 8);
        }
    }
};

const directionDeltas = [
    new Myr.Vector(1, 0),
    new Myr.Vector(1, -1),
    new Myr.Vector(0, -1),
    new Myr.Vector(-1, -1),
    new Myr.Vector(-1, 0),
    new Myr.Vector(-1, 1),
    new Myr.Vector(0, 1),
    new Myr.Vector(1, 1)
];

/**
 * Get the X and Y offset to a neighbor based on direction.
 * @param {Number} direction A direction in the range [0, 7].
 * @returns {Myr.Vector} A vector containing the offset to the neighbor.
 */
PcbPoint.directionToDelta = direction => directionDeltas[direction];

/**
 * Get the direction based on offset.
 * @param {Number} dx The X offset.
 * @param {Number} dy The Y offset.
 * @returns {Number} A direction in the range [0, 7].
 */
PcbPoint.deltaToDirection = (dx, dy) => {
    if (dx === 1)
        return -dy - Math.min(-dy, 0) * 8;

    return 4 + ((1 + dx) + 1) * dy;
};