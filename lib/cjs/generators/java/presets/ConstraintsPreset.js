"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_CONSTRAINTS_PRESET = void 0;
const models_1 = require("../../../models");
/**
 * Preset which extends class's getters with annotations from `javax.validation.constraints` package
 *
 * @implements {JavaPreset}
 */
exports.JAVA_CONSTRAINTS_PRESET = {
    class: {
        self({ renderer, content, options }) {
            options = options || { useJakarta: false };
            const importFrom = options.useJakarta ? 'jakarta' : 'javax';
            renderer.dependencyManager.addDependency(`import ${importFrom}.validation.constraints.*;`);
            renderer.dependencyManager.addDependency(`import ${importFrom}.validation.Valid;`);
            return content;
        },
        // eslint-disable-next-line sonarjs/cognitive-complexity
        property({ renderer, property, content, model }) {
            if (model.options.isExtended) {
                return '';
            }
            const annotations = [];
            // needs cascade validation
            if (property.property instanceof models_1.ConstrainedReferenceModel ||
                property.property instanceof models_1.ConstrainedObjectModel ||
                property.property instanceof models_1.ConstrainedArrayModel) {
                annotations.push(renderer.renderAnnotation('Valid'));
            }
            if (property.required) {
                annotations.push(renderer.renderAnnotation('NotNull'));
            }
            const originalInput = property.property.originalInput;
            // string
            if (property.property instanceof models_1.ConstrainedStringModel) {
                const pattern = originalInput['pattern'];
                if (pattern !== undefined) {
                    annotations.push(renderer.renderAnnotation('Pattern', {
                        regexp: renderer.renderStringLiteral(pattern)
                    }));
                }
                const minLength = originalInput['minLength'];
                const maxLength = originalInput['maxLength'];
                if (minLength !== undefined || maxLength !== undefined) {
                    annotations.push(renderer.renderAnnotation('Size', {
                        min: minLength,
                        max: maxLength
                    }));
                }
            }
            // number/integer
            if (property.property instanceof models_1.ConstrainedFloatModel ||
                property.property instanceof models_1.ConstrainedIntegerModel) {
                const minimum = originalInput['minimum'];
                if (minimum !== undefined) {
                    annotations.push(renderer.renderAnnotation('Min', minimum));
                }
                const exclusiveMinimum = originalInput['exclusiveMinimum'];
                if (exclusiveMinimum !== undefined) {
                    annotations.push(renderer.renderAnnotation('Min', exclusiveMinimum + 1));
                }
                const maximum = originalInput['maximum'];
                if (maximum !== undefined) {
                    annotations.push(renderer.renderAnnotation('Max', maximum));
                }
                const exclusiveMaximum = originalInput['exclusiveMaximum'];
                if (exclusiveMaximum !== undefined) {
                    annotations.push(renderer.renderAnnotation('Max', exclusiveMaximum - 1));
                }
            }
            // array
            if (property.property instanceof models_1.ConstrainedArrayModel) {
                const minItems = originalInput['minItems'];
                const maxItems = originalInput['maxItems'];
                if (minItems !== undefined || maxItems !== undefined) {
                    annotations.push(renderer.renderAnnotation('Size', {
                        min: minItems,
                        max: maxItems
                    }));
                }
            }
            return renderer.renderBlock([...annotations, content]);
        }
    }
};
//# sourceMappingURL=ConstraintsPreset.js.map