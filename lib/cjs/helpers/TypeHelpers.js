"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypeFromMapping = void 0;
const ConstrainedMetaModel_1 = require("../models/ConstrainedMetaModel");
function getTypeFromMapping(typeMapping, context) {
    if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedObjectModel) {
        return typeMapping.Object(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedReferenceModel) {
        return typeMapping.Reference(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedAnyModel) {
        return typeMapping.Any(context);
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedFloatModel) {
        return typeMapping.Float(context);
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedIntegerModel) {
        return typeMapping.Integer(context);
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedStringModel) {
        return typeMapping.String(context);
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedBooleanModel) {
        return typeMapping.Boolean(context);
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedTupleModel) {
        return typeMapping.Tuple(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedArrayModel) {
        return typeMapping.Array(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedEnumModel) {
        return typeMapping.Enum(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedUnionModel) {
        return typeMapping.Union(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    else if (context.constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedDictionaryModel) {
        return typeMapping.Dictionary(Object.assign(Object.assign({}, context), { constrainedModel: context.constrainedModel }));
    }
    throw new Error('Could not find type for model');
}
exports.getTypeFromMapping = getTypeFromMapping;
//# sourceMappingURL=TypeHelpers.js.map