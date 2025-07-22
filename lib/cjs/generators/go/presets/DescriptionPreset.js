"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GO_DESCRIPTION_PRESET = void 0;
const renderDescription = ({ renderer, content, item }) => {
    var _a;
    const desc = (_a = item.originalInput.description) === null || _a === void 0 ? void 0 : _a.trim();
    let formattedDesc = '';
    if (desc) {
        formattedDesc = renderer.renderComments(desc);
        formattedDesc += '\n';
    }
    return formattedDesc + content;
};
/**
 * Preset which adds descriptions
 *
 * @implements {GoPreset}
 */
exports.GO_DESCRIPTION_PRESET = {
    struct: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        },
        field({ renderer, field, content }) {
            return renderDescription({ renderer, content, item: field.property });
        }
    },
    enum: {
        self({ renderer, model, content }) {
            return renderDescription({ renderer, content, item: model });
        }
    }
};
//# sourceMappingURL=DescriptionPreset.js.map