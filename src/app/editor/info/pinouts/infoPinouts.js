import {InfoPinoutEntry} from "./infoPinoutEntry";
import {Pin} from "../../../part/pin";
import {getString} from "../../../language";
import {InfoPinoutEntryDescription} from "./infoPinoutEntryDescription";

/**
 * A list of pinouts.
 * @param {Object} configuration A valid part configuration to read pins from.
 * @param {HTMLElement} info An element to add extra information to.
 * @param {Number} [pinIndex] An optional index of the selected pin. If set, the description will be shown in the table.
 * @constructor
 */
export function InfoPinouts(configuration, info, pinIndex) {
    const _element = document.createElement("table");
    const _entries = [];

    let _overlay = null;

    const makeDescriptionRow = description => {
        const row = document.createElement("tr");
        const column = document.createElement("td");

        row.className = InfoPinouts.CLASS_INLINE_DESCRIPTION;
        column.colSpan = 2;

        column.appendChild(description.getElement());
        row.appendChild(column);

        return row;
    };

    const make = () => {
        _element.className = InfoPinouts.CLASS;

        let index = 0;
        let descriptions = [];

        for (const pin of configuration.io) if (pin.type !== Pin.TYPE_STRUCTURAL) {
            let description = null;

            if (pinIndex === undefined) {
                description = new InfoPinoutEntryDescription(getString(pin.description)).getElement();
                descriptions.push(description);
            }

            const entry = new InfoPinoutEntry(index + 1, pin, pinIndex === index, description);
            _entries.push(entry);

            _element.appendChild(entry.getElement());

            if (pinIndex !== undefined && pinIndex === index)
                _element.appendChild(makeDescriptionRow(new InfoPinoutEntryDescription(getString(pin.description))));

            ++index;
        }

        for (const description of descriptions)
            info.appendChild(description);
    };

    /**
     * Get the HTML element of this pinout information.
     * @returns {HTMLElement} The HTML element of this list.
     */
    this.getElement = () => _element;

    /**
     * Set or unset a pinout overlay to highlight labels on.
     * @param {OverlayPinouts} overlay An overlay, or null if no overlay is selected.
     */
    this.setOverlay = overlay => {
        _overlay = overlay;

        if (_overlay) {
            let index = 0;

            for (const entry of _entries)
                entry.setLabel(_overlay.getPin(index++));
        }
        else {
            for (const entry of _entries)
                entry.setLabel(null);
        }
    };

    make();
}

InfoPinouts.formatIndex = index => {
    let result = index.toString();

    while (result.length < InfoPinouts.INDEX_PADDING)
        result = "0" + result;

    return result;
};

InfoPinouts.CLASS = "pinouts";
InfoPinouts.CLASS_INLINE_DESCRIPTION = "inline-description";
InfoPinouts.INDEX_PADDING = 2;