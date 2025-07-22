"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHP_DESCRIPTION_PRESET = void 0;
function renderDescription({ content, model }) {
    if (!model.originalInput['description']) {
        return content;
    }
    const description = model.originalInput['description'];
    return `/**
 * ${description}
 */
${content}`;
}
/**
 * Preset which adds description to rendered model.
 *
 * @implements {PhpPreset}
 */
exports.PHP_DESCRIPTION_PRESET = {
    class: {
        self({ content, model }) {
            return renderDescription({ content, model });
        }
    },
    enum: {
        self({ content, model }) {
            return renderDescription({ content, model });
        }
    }
};
//# sourceMappingURL=DescriptionPreset.js.map