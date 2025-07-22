"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constrainMetaModel = void 0;
const ConstrainedMetaModel_1 = require("../models/ConstrainedMetaModel");
const ConstrainedTypes_1 = require("./ConstrainedTypes");
const MetaModelToConstrained_1 = require("./MetaModelToConstrained");
function constrainMetaModel(typeMapping, constrainRules, context, safeTypes = [
    ConstrainedMetaModel_1.ConstrainedAnyModel,
    ConstrainedMetaModel_1.ConstrainedBooleanModel,
    ConstrainedMetaModel_1.ConstrainedFloatModel,
    ConstrainedMetaModel_1.ConstrainedIntegerModel,
    ConstrainedMetaModel_1.ConstrainedStringModel,
    ConstrainedMetaModel_1.ConstrainedReferenceModel,
    ConstrainedMetaModel_1.ConstrainedObjectModel,
    ConstrainedMetaModel_1.ConstrainedEnumModel,
    ConstrainedMetaModel_1.ConstrainedObjectModel,
    ConstrainedMetaModel_1.ConstrainedUnionModel,
    ConstrainedMetaModel_1.ConstrainedArrayModel,
    ConstrainedMetaModel_1.ConstrainedDictionaryModel,
    ConstrainedMetaModel_1.ConstrainedTupleModel
]) {
    const constrainedModel = (0, MetaModelToConstrained_1.metaModelFactory)(constrainRules, context, new Map());
    (0, ConstrainedTypes_1.applyTypesAndConst)({
        constrainedModel,
        generatorOptions: context.options,
        typeMapping,
        alreadySeenModels: new Map(),
        safeTypes,
        dependencyManager: context.dependencyManager,
        constrainRules
    });
    return constrainedModel;
}
exports.constrainMetaModel = constrainMetaModel;
//# sourceMappingURL=ConstrainHelpers.js.map