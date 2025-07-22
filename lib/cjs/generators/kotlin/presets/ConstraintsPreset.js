"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KOTLIN_CONSTRAINTS_PRESET = void 0;
const models_1 = require("../../../models");
exports.KOTLIN_CONSTRAINTS_PRESET = {
    class: {
        self({ renderer, content, options }) {
            options = options || { useJakarta: false };
            const importFrom = options.useJakarta ? 'jakarta' : 'javax';
            renderer.dependencyManager.addDependency(`${importFrom}.validation.constraints.*`);
            return content;
        },
        property({ renderer, property, content }) {
            const annotations = [];
            if (property.required) {
                annotations.push(renderer.renderAnnotation('NotNull', null, 'get:'));
            }
            annotations.push(...getTypeSpecificAnnotations(property.property, renderer));
            return renderer.renderBlock([...annotations, content]);
        }
    }
};
function getTypeSpecificAnnotations(property, renderer) {
    if (property instanceof models_1.ConstrainedStringModel) {
        return getStringAnnotations(property, renderer);
    }
    else if (property instanceof models_1.ConstrainedFloatModel ||
        property instanceof models_1.ConstrainedIntegerModel) {
        return getNumericAnnotations(property, renderer);
    }
    else if (property instanceof models_1.ConstrainedArrayModel) {
        return getArrayAnnotations(property, renderer);
    }
    return [];
}
function getStringAnnotations(property, renderer) {
    const annotations = [];
    const originalInput = property.originalInput;
    if (originalInput['pattern'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Pattern', { regexp: `"${originalInput['pattern']}"` }, 'get:'));
    }
    if (originalInput['minLength'] !== undefined ||
        originalInput['maxLength'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Size', { min: originalInput['minLength'], max: originalInput['maxLength'] }, 'get:'));
    }
    return annotations;
}
function getNumericAnnotations(property, renderer) {
    const annotations = [];
    const originalInput = property.originalInput;
    if (originalInput['minimum'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Min', originalInput['minimum'], 'get:'));
    }
    if (originalInput['exclusiveMinimum'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Min', originalInput['exclusiveMinimum'] + 1, 'get:'));
    }
    if (originalInput['maximum'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Max', originalInput['maximum'], 'get:'));
    }
    if (originalInput['exclusiveMaximum'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Max', originalInput['exclusiveMaximum'] - 1, 'get:'));
    }
    return annotations;
}
function getArrayAnnotations(property, renderer) {
    const annotations = [];
    const originalInput = property.originalInput;
    if (originalInput['minItems'] !== undefined ||
        originalInput['maxItems'] !== undefined) {
        annotations.push(renderer.renderAnnotation('Size', { min: originalInput['minItems'], max: originalInput['maxItems'] }, 'get:'));
    }
    return annotations;
}
//# sourceMappingURL=ConstraintsPreset.js.map