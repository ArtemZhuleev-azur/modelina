"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTypesAndConst = void 0;
const utils_1 = require("../utils");
const ConstrainedMetaModel_1 = require("../models/ConstrainedMetaModel");
const TypeHelpers_1 = require("./TypeHelpers");
/**
 * Apply const and type to models from the constraint rules
 */
function applyTypeAndConst(context) {
    const { constrainedModel, typeMapping, partOfProperty, dependencyManager, generatorOptions, alreadySeenModels, constrainRules } = context;
    if (constrainedModel.type !== '') {
        return;
    }
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: generatorOptions,
        partOfProperty,
        dependencyManager
    });
    if (constrainedModel.options.const) {
        const constrainedConstant = constrainRules.constant({
            constrainedMetaModel: constrainedModel,
            options: generatorOptions
        });
        constrainedModel.options.const.value = constrainedConstant;
    }
    alreadySeenModels.set(constrainedModel, constrainedModel.type);
}
/**
 * Applying types and const through cyclic analysis (https://en.wikipedia.org/wiki/Cycle_(graph_theory))
 * to detect and adapt unmanageable cyclic models where we cant determine types as normal.
 *
 * For example;
 *  Model a: Union model with Model b
 *  Model b: Union model with Model a
 * In such case we are unable to render the type, cause each depend on each other to determine the type.
 *
 * The algorithm currently adapts the models so we end up with;
 *  Model a: Union model with Model b
 *  Model b: Union model with any model
 *
 * Additionally (regretfully, but for now) we also constrain `constant` and `discriminator` values here, because they depend on types in most cases and cant be determined before then.
 */
function applyTypesAndConst(context) {
    const { constrainedModel, safeTypes, alreadySeenModels } = context;
    const isCyclicModel = alreadySeenModels.has(constrainedModel) &&
        alreadySeenModels.get(constrainedModel) === undefined;
    const hasBeenSolved = alreadySeenModels.has(constrainedModel);
    if (isCyclicModel) {
        //Cyclic models detected, having to make the edge (right before cyclic occur) to use AnyModel (most open type we have)
        //With the same information as the node we are currently on.
        //This is to open up the cycle so we can finish determining types.
        utils_1.Logger.warn(`Cyclic models detected, we have to replace ${constrainedModel.originalInput} with AnyModel...`);
        const anyModel = new ConstrainedMetaModel_1.ConstrainedAnyModel(constrainedModel.name, constrainedModel.originalInput, constrainedModel.options, '');
        applyTypeAndConst(Object.assign(Object.assign({}, context), { constrainedModel: anyModel }));
        return anyModel;
    }
    else if (hasBeenSolved) {
        return undefined;
    }
    //Mark the model as having been walked but has not been given a type yet
    alreadySeenModels.set(constrainedModel, undefined);
    //Walk over all safe models that can determine it's type right away
    for (const safeType of safeTypes) {
        if (constrainedModel instanceof safeType) {
            applyTypeAndConst(Object.assign(Object.assign({}, context), { constrainedModel }));
            break;
        }
    }
    //Walk over all nested models
    walkNode(context);
}
exports.applyTypesAndConst = applyTypesAndConst;
/**
 * A node is a model that can contain other models.
 *
 * This function walks over all of them, and if cyclic models are detected open up it up.
 */
function walkNode(context) {
    const { constrainedModel } = context;
    if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedObjectModel) {
        walkObjectNode(context);
    }
    else if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedDictionaryModel) {
        walkDictionaryNode(context);
    }
    else if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedTupleModel) {
        walkTupleNode(context);
    }
    else if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedArrayModel) {
        walkArrayNode(context);
    }
    else if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedUnionModel) {
        walkUnionNode(context);
    }
    else if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedReferenceModel) {
        walkReferenceNode(context);
    }
    applyTypeAndConst(Object.assign(Object.assign({}, context), { constrainedModel }));
    if (constrainedModel instanceof ConstrainedMetaModel_1.ConstrainedUnionModel) {
        addDiscriminatorTypeToUnionModel(constrainedModel);
    }
}
function walkObjectNode(context) {
    const objectModel = context.constrainedModel;
    for (const [propertyKey, propertyModel] of Object.entries(Object.assign({}, objectModel.properties))) {
        const overWriteModel = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: propertyModel.property, partOfProperty: propertyModel }));
        if (overWriteModel) {
            // eslint-disable-next-line security/detect-object-injection
            objectModel.properties[propertyKey].property = overWriteModel;
        }
    }
}
function walkDictionaryNode(context) {
    const dictionaryModel = context.constrainedModel;
    const overwriteKeyModel = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: dictionaryModel.key, partOfProperty: undefined }));
    if (overwriteKeyModel) {
        dictionaryModel.key = overwriteKeyModel;
    }
    const overWriteValueModel = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: dictionaryModel.value, partOfProperty: undefined }));
    if (overWriteValueModel) {
        dictionaryModel.value = overWriteValueModel;
    }
}
function walkTupleNode(context) {
    const tupleModel = context.constrainedModel;
    for (const [index, tupleMetaModel] of [...tupleModel.tuple].entries()) {
        const overwriteTupleModel = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: tupleMetaModel.value, partOfProperty: undefined }));
        if (overwriteTupleModel) {
            // eslint-disable-next-line security/detect-object-injection
            tupleModel.tuple[index].value = overwriteTupleModel;
        }
    }
}
function walkArrayNode(context) {
    const arrayModel = context.constrainedModel;
    const overWriteArrayModel = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: arrayModel.valueModel, partOfProperty: undefined }));
    if (overWriteArrayModel) {
        arrayModel.valueModel = overWriteArrayModel;
    }
}
function walkUnionNode(context) {
    const unionModel = context.constrainedModel;
    //If all union value models have type, we can go ahead and get the type for the union as well.
    for (const [index, unionValueModel] of [...unionModel.union].entries()) {
        const overwriteUnionModel = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: unionValueModel, partOfProperty: undefined }));
        if (overwriteUnionModel) {
            // eslint-disable-next-line security/detect-object-injection
            unionModel.union[index] = overwriteUnionModel;
        }
    }
}
function walkReferenceNode(context) {
    const referenceModel = context.constrainedModel;
    const overwriteReference = applyTypesAndConst(Object.assign(Object.assign({}, context), { constrainedModel: referenceModel.ref, partOfProperty: undefined }));
    if (overwriteReference) {
        referenceModel.ref = overwriteReference;
    }
}
function addDiscriminatorTypeToUnionModel(constrainedModel) {
    if (!constrainedModel.options.discriminator) {
        return;
    }
    const propertyTypes = new Set();
    for (const union of constrainedModel.union) {
        if (union instanceof ConstrainedMetaModel_1.ConstrainedReferenceModel) {
            const ref = union.ref;
            if (ref instanceof ConstrainedMetaModel_1.ConstrainedObjectModel) {
                const discriminatorProp = Object.values(ref.properties).find((model) => {
                    var _a;
                    return model.unconstrainedPropertyName ===
                        ((_a = constrainedModel.options.discriminator) === null || _a === void 0 ? void 0 : _a.discriminator);
                });
                if (discriminatorProp) {
                    propertyTypes.add(discriminatorProp.property.type);
                }
            }
        }
    }
    if (propertyTypes.size === 1) {
        constrainedModel.options.discriminator.type = propertyTypes
            .keys()
            .next().value;
    }
}
//# sourceMappingURL=ConstrainedTypes.js.map