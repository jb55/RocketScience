/**
 * An objective made up of a number of goals.
 * @param {Array} goals An array of valid goals to complete.
 * @constructor
 */
export function Objective(goals) {
    /**
     * Prime this objective for operation.
     * @param {Array} objects An array containing all editable PCB's as game objects in order.
     */
    this.prime = objects => {
        for (const goal of goals)
            goal.prime(objects);
    };

    /**
     * Check if all goals check out.
     * @returns {Boolean} A boolean which is true if this objective is met.
     */
    this.validate = () => {
        for (const goal of goals) if (!goal.validate())
            return false;

        return true;
    };
}