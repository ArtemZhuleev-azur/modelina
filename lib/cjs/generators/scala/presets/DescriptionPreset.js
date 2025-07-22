"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCALA_DESCRIPTION_PRESET = void 0;
const helpers_1 = require("../../../helpers");
const models_1 = require("../../../models");
function renderDescription({ renderer, content, item }) {
    if (!item.originalInput['description']) {
        return content;
    }
    let comment = `${item.originalInput['description']}`;
    if (item instanceof models_1.ConstrainedObjectModel) {
        const properties = Object.keys(item.properties)
            .map((key) => item.properties[`${key}`])
            .map((model) => {
            const property = `@property ${model.propertyName}`;
            const desc = model.property.originalInput['description'];
            return desc !== undefined ? `${property} ${desc}` : property;
        })
            .join('\n');
        comment += `\n\n${properties}`;
    }
    const examples = Array.isArray(item.originalInput['examples'])
        ? `Examples: \n${helpers_1.FormatHelpers.renderJSONExamples(item.originalInput['examples'])}`
        : null;
    if (examples !== null) {
        comment += `\n\n${examples}`;
    }
    return `${renderer.renderComments(comment)}\n${content}`;
}
/**
 * Preset which adds description to rendered model.
 *
 * @implements {ScalaPreset}
 */
exports.SCALA_DESCRIPTION_PRESET = {
    class: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        }
    },
    enum: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        }
    }
};
//# sourceMappingURL=DescriptionPreset.js.map