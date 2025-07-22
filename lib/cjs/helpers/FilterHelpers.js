"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOriginalPropertyList = exports.getDictionary = exports.getNormalProperties = void 0;
const models_1 = require("../models");
/**
 * Filter out all properties that are dictionary models with unwrap serialization type.
 */
function getNormalProperties(properties) {
    return Object.entries(properties).filter(([, value]) => !(value.property instanceof models_1.ConstrainedDictionaryModel) ||
        (value.property instanceof models_1.ConstrainedDictionaryModel &&
            value.property.serializationType !== 'unwrap'));
}
exports.getNormalProperties = getNormalProperties;
/**
 * Filter out all properties that are dictionary models with unwrap serialization type.
 */
function getDictionary(properties) {
    return Object.entries(properties).filter(([, value]) => value.property instanceof models_1.ConstrainedDictionaryModel &&
        value.property.serializationType === 'unwrap');
}
exports.getDictionary = getDictionary;
/**
 * Filter properties and return unconstrained property names for each property
 */
function getOriginalPropertyList(properties) {
    return Object.entries(properties).map(([, model]) => {
        return model.unconstrainedPropertyName;
    });
}
exports.getOriginalPropertyList = getOriginalPropertyList;
//# sourceMappingURL=FilterHelpers.js.map