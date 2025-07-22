"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_DESCRIPTION_PRESET = void 0;
const helpers_1 = require("../../../helpers");
const ClassRenderer_1 = require("../renderers/ClassRenderer");
function renderDescription({ renderer, content, item }) {
    let desc = item.originalInput['description'];
    const examples = item.originalInput['examples'];
    if (Array.isArray(examples)) {
        const renderedExamples = helpers_1.FormatHelpers.renderJSONExamples(examples);
        const exampleDesc = `Examples: ${renderedExamples}`;
        desc = desc ? `${desc}\n${exampleDesc}` : exampleDesc;
    }
    if (desc) {
        const renderedDesc = renderer.renderComments(desc);
        return `${renderedDesc}\n${content}`;
    }
    return content;
}
/**
 * Preset which adds description to rendered model.
 *
 * @implements {JavaPreset}
 */
exports.JAVA_DESCRIPTION_PRESET = {
    class: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        },
        getter({ renderer, property, content, model }) {
            if (model.options.isExtended &&
                (0, ClassRenderer_1.isDiscriminatorOrDictionary)(model, property)) {
                return '';
            }
            return renderDescription({ renderer, content, item: property.property });
        }
    },
    enum: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        }
    }
};
//# sourceMappingURL=DescriptionPreset.js.map