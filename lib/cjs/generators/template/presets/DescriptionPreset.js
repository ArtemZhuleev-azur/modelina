"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATE_DESCRIPTION_PRESET = void 0;
/**
 * Preset which adds description to rendered model.
 *
 * @implements {TemplatePreset}
 */
exports.TEMPLATE_DESCRIPTION_PRESET = {
    class: {
        self({ content }) {
            const renderedDesc = 'my description';
            return `${renderedDesc}\n${content}`;
        },
        getter({ content }) {
            const renderedDesc = 'my description';
            return `${renderedDesc}\n${content}`;
        }
    },
    enum: {
        self({ content }) {
            const renderedDesc = 'my description';
            return `${renderedDesc}\n${content}`;
        }
    }
};
//# sourceMappingURL=DescriptionPreset.js.map