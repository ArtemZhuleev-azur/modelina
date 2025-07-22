"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS_DESCRIPTION_PRESET = void 0;
const renderDescription = ({ renderer, content, item }) => {
    var _a;
    const desc = (_a = item.originalInput.description) === null || _a === void 0 ? void 0 : _a.trim();
    const examples = item.originalInput.examples;
    const formattedExamples = `@example ${(examples === null || examples === void 0 ? void 0 : examples.join) ? examples.join(', ') : examples}`;
    if (desc || examples) {
        const doc = renderer.renderComments(`${desc || ''}\n${examples ? formattedExamples : ''}`.trim());
        return `${doc}\n${content}`;
    }
    return content;
};
/**
 * Preset which adds descriptions
 *
 * @implements {TypeScriptPreset}
 */
exports.TS_DESCRIPTION_PRESET = {
    class: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        },
        getter({ renderer, property, content }) {
            return renderDescription({ renderer, content, item: property.property });
        }
    },
    interface: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        },
        property({ renderer, property, content }) {
            return renderDescription({ renderer, content, item: property.property });
        }
    },
    type: {
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