"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretName = exports.inferTypeFromValue = exports.isModelObject = exports.isEnum = void 0;
/**
 * Check if CommonModel is an enum
 *
 * @param model
 */
function isEnum(model) {
    if (model.enum !== undefined) {
        return true;
    }
    return false;
}
exports.isEnum = isEnum;
/**
 * Check if CommonModel is a separate model or a simple model.
 * @param model
 */
function isModelObject(model) {
    if (model.type !== undefined) {
        // If all possible JSON types are defined, don't split it even if it does contain object.
        if (Array.isArray(model.type) && model.type.length === 7) {
            return false;
        }
        return model.type.includes('object');
    }
    return false;
}
exports.isModelObject = isModelObject;
/**
 * Infers the JSON Schema type from value
 *
 * @param value to infer type of
 */
function inferTypeFromValue(value) {
    if (Array.isArray(value)) {
        return 'array';
    }
    if (value === null) {
        return 'null';
    }
    const typeOfEnum = typeof value;
    if (typeOfEnum === 'bigint') {
        return 'integer';
    }
    return typeOfEnum;
}
exports.inferTypeFromValue = inferTypeFromValue;
/**
 * Find the name for simplified version of schema
 *
 * @param schema to find the name
 */
function interpretName(schema) {
    if (schema && typeof schema === 'object') {
        return schema.title || schema.$id || schema['x-modelgen-inferred-name'];
    }
}
exports.interpretName = interpretName;
//# sourceMappingURL=Utils.js.map