"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHP_JSON_SERIALIZABLE_PRESET = void 0;
const models_1 = require("../../../models");
function renderSelf({ content }) {
    const contentLines = content.split('\n');
    contentLines[0] += ` implements \\JsonSerializable`;
    return contentLines.join('\n');
}
/**
 * Preset, which implements PHP’s JsonSerializable interface.
 *
 * Using this will allow to json serialize the model using `json_encode()`.
 *
 * @implements {PhpPreset}
 */
exports.PHP_JSON_SERIALIZABLE_PRESET = {
    class: {
        self({ content, renderer }) {
            return renderSelf({ content, renderer });
        },
        additionalContent({ renderer, model, content }) {
            const serializedProperties = Object.values(model.properties).map((property) => {
                if (property.property instanceof models_1.ConstrainedDictionaryModel &&
                    property.property.serializationType === 'unwrap') {
                    return `...$this->${property.propertyName},`;
                }
                return `'${property.unconstrainedPropertyName}' => $this->${property.propertyName},`;
            });
            return (content +
                renderer.renderBlock([
                    'public function jsonSerialize(): array',
                    '{',
                    renderer.indent(renderer.renderBlock([
                        'return [',
                        renderer.indent(renderer.renderBlock(serializedProperties)),
                        '];'
                    ])),
                    '}'
                ]));
        }
    },
    enum: {
        self({ content, renderer }) {
            return renderSelf({ content, renderer });
        },
        additionalContent({ content, model, renderer }) {
            return (content +
                renderer.renderBlock([
                    `public function jsonSerialize(): mixed`,
                    '{',
                    renderer.indent(renderer.renderBlock([
                        'return match($this) {',
                        renderer.indent(renderer.renderBlock(Object.values(model.values).map((value) => `self::${value.key} => ${value.value},`))),
                        '};'
                    ])),
                    '}'
                ]));
        }
    }
};
//# sourceMappingURL=JsonSerializablePreset.js.map