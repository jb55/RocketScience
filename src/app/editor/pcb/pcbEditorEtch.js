import {Pcb} from "../../pcb/pcb";
import {PcbPathRenderer} from "../../pcb/pcbPathRenderer";

/**
 * The etch editor, meant for etching connections onto the PCB.
 * @param {Sprites} sprites A sprites instance.
 * @param {Pcb} pcb The PCB currently being edited.
 * @param {Myr.Vector} cursor The cursor position in cells.
 * @param {Object} editor An interface provided by the Editor to influence the editor.
 * @constructor
 */
export function PcbEditorEtch(sprites, pcb, cursor, editor) {
    const SPRITE_ETCH = sprites.getSprite("pcbEtch");
    const SPRITE_ETCH_HOVER = sprites.getSprite("pcbEtchHover");

    const _pathRenderer = new PcbPathRenderer(sprites, true);
    const _path = [];

    let _startPoint = null;
    let _dragging = false;
    let _etchable = false;

    const makePath = () => {
        const at = _startPoint.copy();
        let lastEntry = new PcbEditorEtch.PathEntry(at.x, at.y, 0);

        _path.push(lastEntry);

        while (!at.equals(cursor)) {
            // Move towards the cursor
            if (at.x < cursor.x)
                ++at.x;
            else if (at.x > cursor.x)
                --at.x;

            if (at.y < cursor.y)
                ++at.y;
            else if (at.y > cursor.y)
                --at.y;

            const point = pcb.getPoint(at.x, at.y);

            if (!point) {
                clearPath();

                break;
            }

            // Add new position to path
            const entry = new PcbEditorEtch.PathEntry(at.x, at.y, 0);

            _path.push(entry);

            // Calculate difference
            const dx = lastEntry.x - entry.x;
            const dy = lastEntry.y - entry.y;
            let direction;

            // Connect new entry to previous one
            switch (dx) {
                case -1:
                    switch (dy) {
                        case -1:
                            direction = 3;
                            break;
                        case 0:
                            direction = 4;
                            break;
                        case 1:
                            direction = 5;
                            break;
                    }
                    break;
                case 0:
                    switch (dy) {
                        case -1:
                            direction = 2;
                            break;
                        case 1:
                            direction = 6;
                            break;
                    }
                    break;
                case 1:
                    switch (dy) {
                        case -1:
                            direction = 1;
                            break;
                        case 0:
                            direction = 0;
                            break;
                        case 1:
                            direction = 7;
                            break;
                    }
                    break;
            }

            entry.paths |= 1 << direction;
            lastEntry.paths |= 1 << ((direction + 4) % 8);

            lastEntry = entry;
        }
    };

    const etch = () => {
        editor.undoPush();

        for (const entry of _path) {
            pcb.getPoint(entry.x, entry.y).paths |= entry.paths;
        }

        editor.revalidate();
    };

    const clearPath = () => {
        _path.splice(0, _path.length);
    };

    /**
     * Change the PCB being edited.
     * @param {Pcb} newPcb The new PCB to edit.
     */
    this.updatePcb = newPcb => {
        pcb = newPcb;
    };

    /**
     * A key is pressed.
     * @param {String} key A key.
     * @param {Boolean} control Indicates whether the control button is pressed.
     */
    this.onKeyDown = (key, control) => {

    };

    /**
     * Tell the editor the cursor has moved.
     */
    this.moveCursor = () => {
        const point = pcb.getPoint(cursor.x, cursor.y);

        if (_dragging) {
            clearPath();

            if (point)
                makePath();
        }
        else
            _etchable = point !== null;
    };

    /**
     * Start dragging action.
     * @returns {Boolean} A boolean indicating whether a drag event has started.
     */
    this.mouseDown = () => {
        if (_etchable) {
            _dragging = true;
            _startPoint = cursor.copy();

            return true;
        }

        return false;
    };

    /**
     * Finish the current dragging action.
     */
    this.mouseUp = () => {
        if (_dragging) {
            _dragging = false;

            etch();
            clearPath();
        }
    };

    /**
     * Cancel any actions deviating from this editors base state.
     */
    this.cancelAction = () => {

    };

    /**
     * Reset the editor's current state.
     */
    this.reset = () => {

    };

    /**
     * Update this editor.
     * @param {Number} timeStep The time passed since the last update in seconds.
     */
    this.update = timeStep => {
        if (_dragging)
            SPRITE_ETCH.animate(timeStep);
    };

    /**
     * Draw this editor.
     * @param {Myr} myr A myriad instance.
     */
    this.draw = myr => {
        if (_dragging) {
            for (const entry of _path)
                _pathRenderer.render(entry.paths, entry.x * Pcb.PIXELS_PER_POINT, entry.y * Pcb.PIXELS_PER_POINT);

            SPRITE_ETCH.draw(_startPoint.x * Pcb.PIXELS_PER_POINT, (_startPoint.y - 1) * Pcb.PIXELS_PER_POINT);
        } else if (_etchable)
            SPRITE_ETCH_HOVER.draw(cursor.x * Pcb.PIXELS_PER_POINT, (cursor.y - 1) * Pcb.PIXELS_PER_POINT );
    };
}

PcbEditorEtch.PathEntry = function(x, y, paths) {
    this.x = x;
    this.y = y;
    this.paths = paths;
};