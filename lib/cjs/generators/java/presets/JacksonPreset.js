"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_JACKSON_PRESET = void 0;
const models_1 = require("../../../models");
const JACKSON_ANNOTATION_DEPENDENCY = 'import com.fasterxml.jackson.annotation.*;';
/**
 * Preset which adds `com.fasterxml.jackson` related annotations to class's property getters.
 *
 * @implements {JavaPreset}
 */
exports.JAVA_JACKSON_PRESET = {
    class: {
        self({ renderer, content }) {
            renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
            return content;
        },
        property({ renderer, property, content, model }) {
            if (model.options.isExtended) {
                return '';
            }
            //Properties that are dictionaries with unwrapped options, cannot get the annotation because it cannot be accurately unwrapped by the jackson library.
            const isDictionary = property.property instanceof models_1.ConstrainedDictionaryModel;
            const hasUnwrappedOptions = isDictionary &&
                property.property.serializationType ===
                    'unwrap';
            const blocks = [];
            if (hasUnwrappedOptions) {
                blocks.push(renderer.renderAnnotation('JsonAnySetter'));
                if (!property.required) {
                    blocks.push(renderer.renderAnnotation('JsonInclude', 'JsonInclude.Include.NON_NULL'));
                }
                blocks.push(content);
                return renderer.renderBlock(blocks);
            }
            blocks.push(renderer.renderAnnotation('JsonProperty', `"${property.unconstrainedPropertyName}"`));
            if (!property.required) {
                blocks.push(renderer.renderAnnotation('JsonInclude', 'JsonInclude.Include.NON_NULL'));
            }
            blocks.push(content);
            return renderer.renderBlock(blocks);
        },
        getter({ renderer, property, content, model }) {
            if (model.options.isExtended) {
                return content;
            }
            //Properties that are dictionaries with unwrapped options, cannot get the annotation because it cannot be accurately unwrapped by the jackson library.
            const isDictionary = property.property instanceof models_1.ConstrainedDictionaryModel;
            const hasUnwrappedOptions = isDictionary &&
                property.property.serializationType ===
                    'unwrap';
            const blocks = [];
            if (hasUnwrappedOptions) {
                blocks.push(renderer.renderAnnotation('JsonAnyGetter'));
            }
            blocks.push(content);
            return renderer.renderBlock(blocks);
        }
    },
    enum: {
        self({ renderer, content }) {
            renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
            return content;
        },
        getValue({ content }) {
            return `@JsonValue
${content}`;
        },
        fromValue({ content }) {
            return `@JsonCreator
${content}`;
        }
    },
    union: {
        self({ renderer, content, model }) {
            renderer.dependencyManager.addDependency(JACKSON_ANNOTATION_DEPENDENCY);
            const blocks = [];
            if (model.options.discriminator) {
                const { discriminator } = model.options;
                blocks.push(renderer.renderAnnotation('JsonTypeInfo', {
                    use: 'JsonTypeInfo.Id.NAME',
                    include: 'JsonTypeInfo.As.EXISTING_PROPERTY',
                    property: `"${discriminator.discriminator}"`,
                    visible: 'true'
                }));
                const types = model.union
                    .map((union) => {
                    if (union instanceof models_1.ConstrainedReferenceModel &&
                        union.ref instanceof models_1.ConstrainedObjectModel) {
                        const discriminatorProp = Object.values(union.ref.properties).find((model) => model.unconstrainedPropertyName ===
                            discriminator.discriminator);
                        if (discriminatorProp === null || discriminatorProp === void 0 ? void 0 : discriminatorProp.property.options.const) {
                            return `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${discriminatorProp.property.options.const.originalInput}")`;
                        }
                    }
                    return `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${union.name}")`;
                })
                    .join(',\n');
                blocks.push(renderer.renderAnnotation('JsonSubTypes', `{\n${types}\n}`));
            }
            else {
                blocks.push(renderer.renderAnnotation('JsonTypeInfo', {
                    use: 'JsonTypeInfo.Id.DEDUCTION'
                }));
                const types = model.union
                    .map((union) => `  @JsonSubTypes.Type(value = ${union.name}.class, name = "${union.name}")`)
                    .join(',\n');
                blocks.push(renderer.renderAnnotation('JsonSubTypes', `{\n${types}\n}`));
            }
            return renderer.renderBlock([...blocks, content]);
        }
    }
};
//# sourceMappingURL=JacksonPreset.js.map