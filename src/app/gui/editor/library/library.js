import "../../../../styles/library.css"
import parts from "../../../../assets/parts.json"
import {PcbEditorPlace} from "../pcb/pcbEditorPlace";
import {Category} from "./category";
import {Toolbar} from "../toolbar/toolbar";
import {Info} from "../info/info";

/**
 * An HTML based part library.
 * @param {PcbEditor} editor A PcbEditor which places selected objects.
 * @param {Toolbar} toolbar A toolbar to press buttons on.
 * @param {Info} info An information box.
 * @param {Object} overlay An element to place the library on.
 * @constructor
 */
export function Library(editor, toolbar, info, overlay) {
    const _container = document.createElement("div");
    const _categories = [];

    const setPart = part => {
        toolbar.default();

        editor.place([new PcbEditorPlace.Fixture(part, 0, 0)]);
    };

    const build = () => {
        const categories = document.createElement("div");

        _container.id = Library.ID;
        categories.id = Library.PARTS_ID;

        for (const category of parts.categories) {
            const newCategory = new Category(category, setPart, info);

            _categories.push(newCategory);
            categories.appendChild(newCategory.getElement());
        }

        _container.appendChild(categories);
        _container.appendChild(info.getElement());
        _container.appendChild(info.getExtension());
    };

    /**
     * Set the part budget the library should respect.
     * @param {BudgetInventory} budget A budget, or null if there is no budget.
     * @param {PartSummary} summary A summary of all the currently used parts.
     */
    this.setBudget = (budget, summary) => {
        for (const category of _categories)
            category.setBudget(budget, summary);
    };

    /**
     * Hide the library. This does not delete the library.
     * It can be shown again later using show().
     */
    this.hide = () => {
        overlay.removeChild(_container);

        info.hide();
    };

    /**
     * Show the library.
     */
    this.show = () => {
        overlay.appendChild(_container);

        info.show();
    };

    build();
}

Library.ID = "library";
Library.PARTS_ID = "parts";