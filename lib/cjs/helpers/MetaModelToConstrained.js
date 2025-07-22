"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaModelFactory = void 0;
const ConstrainedMetaModel_1 = require("../models/ConstrainedMetaModel");
const MetaModel_1 = require("../models/MetaModel");
const placeHolderConstrainedObject = new ConstrainedMetaModel_1.ConstrainedAnyModel('', undefined, {}, '');
function getConstrainedMetaModelOptions(metaModel) {
    const options = {};
    options.const = metaModel.options.const;
    options.isNullable = metaModel.options.isNullable;
    options.discriminator = metaModel.options.discriminator;
    options.format = metaModel.options.format;
    options.isExtended = metaModel.options.isExtended;
    return options;
}
function referenceModelFactory(constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedReferenceModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '', placeHolderConstrainedObject);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedRefModel = metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.ref, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.ref = constrainedRefModel;
    return constrainedModel;
}
function anyModelFactory(context) {
    return new ConstrainedMetaModel_1.ConstrainedAnyModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '');
}
function floatModelFactory(context) {
    return new ConstrainedMetaModel_1.ConstrainedFloatModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '');
}
function integerModelFactory(context) {
    return new ConstrainedMetaModel_1.ConstrainedIntegerModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '');
}
function stringModelFactory(context) {
    return new ConstrainedMetaModel_1.ConstrainedStringModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '');
}
function booleanModelFactory(context) {
    return new ConstrainedMetaModel_1.ConstrainedBooleanModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '');
}
function tupleModelFactory(constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedTupleModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '', []);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedTupleModels = context.metaModel.tuple.map((tupleValue) => {
        const tupleType = metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: tupleValue.value, partOfProperty: undefined }), alreadySeenModels);
        return new ConstrainedMetaModel_1.ConstrainedTupleValueModel(tupleValue.index, tupleType);
    });
    constrainedModel.tuple = constrainedTupleModels;
    return constrainedModel;
}
function arrayModelFactory(constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedArrayModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '', placeHolderConstrainedObject);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedValueModel = metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.valueModel, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.valueModel = constrainedValueModel;
    return constrainedModel;
}
function unionModelFactory(constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedUnionModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '', []);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedUnionModels = context.metaModel.union.map((unionValue) => {
        return metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: unionValue, partOfProperty: undefined }), alreadySeenModels);
    });
    constrainedModel.union = constrainedUnionModels;
    return constrainedModel;
}
function dictionaryModelFactory(constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedDictionaryModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '', placeHolderConstrainedObject, placeHolderConstrainedObject, context.metaModel.serializationType);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const keyModel = metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.key, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.key = keyModel;
    const valueModel = metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.value, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.value = valueModel;
    return constrainedModel;
}
function objectModelFactory(constrainRules, context, alreadySeenModels) {
    var _a;
    const options = getConstrainedMetaModelOptions(context.metaModel);
    if ((_a = context.metaModel.options.extend) === null || _a === void 0 ? void 0 : _a.length) {
        options.extend = [];
        for (const extend of context.metaModel.options.extend) {
            options.extend.push(metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: extend, partOfProperty: undefined }), alreadySeenModels));
        }
    }
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedObjectModel(context.constrainedName, context.metaModel.originalInput, options, '', {});
    alreadySeenModels.set(context.metaModel, constrainedModel);
    for (const propertyMetaModel of Object.values(context.metaModel.properties)) {
        const constrainedPropertyModel = new ConstrainedMetaModel_1.ConstrainedObjectPropertyModel('', propertyMetaModel.propertyName, propertyMetaModel.required, constrainedModel);
        const constrainedPropertyName = constrainRules.propertyKey({
            objectPropertyModel: propertyMetaModel,
            constrainedObjectPropertyModel: constrainedPropertyModel,
            constrainedObjectModel: constrainedModel,
            objectModel: context.metaModel,
            options: context.options
        });
        constrainedPropertyModel.propertyName = constrainedPropertyName;
        const constrainedProperty = metaModelFactory(constrainRules, Object.assign(Object.assign({}, context), { metaModel: propertyMetaModel.property, partOfProperty: constrainedPropertyModel }), alreadySeenModels);
        constrainedPropertyModel.property = constrainedProperty;
        constrainedModel.properties[String(constrainedPropertyName)] =
            constrainedPropertyModel;
    }
    return constrainedModel;
}
function enumModelFactory(constrainRules, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedEnumModel(context.constrainedName, context.metaModel.originalInput, getConstrainedMetaModelOptions(context.metaModel), '', []);
    const enumValueToConstrainedEnumValueModel = (enumValue) => {
        const constrainedEnumKey = constrainRules.enumKey({
            enumKey: String(enumValue.key),
            enumModel: context.metaModel,
            constrainedEnumModel: constrainedModel,
            options: context.options
        });
        const constrainedEnumValue = constrainRules.enumValue({
            enumValue: enumValue.value,
            enumModel: context.metaModel,
            constrainedEnumModel: constrainedModel,
            options: context.options
        });
        return new ConstrainedMetaModel_1.ConstrainedEnumValueModel(constrainedEnumKey, constrainedEnumValue, enumValue.value);
    };
    for (const enumValue of context.metaModel.values) {
        constrainedModel.values.push(enumValueToConstrainedEnumValueModel(enumValue));
    }
    return constrainedModel;
}
// eslint-disable-next-line sonarjs/cognitive-complexity
function metaModelFactory(constrainRules, context, alreadySeenModels = new Map()) {
    if (alreadySeenModels.has(context.metaModel)) {
        return alreadySeenModels.get(context.metaModel);
    }
    const constrainedName = constrainRules.modelName({
        modelName: context.metaModel.name,
        options: context.options
    });
    const newContext = Object.assign(Object.assign({}, context), { constrainedName });
    if (newContext.metaModel instanceof MetaModel_1.ObjectModel) {
        return objectModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.ReferenceModel) {
        return referenceModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.DictionaryModel) {
        return dictionaryModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.TupleModel) {
        return tupleModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.ArrayModel) {
        return arrayModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.UnionModel) {
        return unionModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    // Simple models are those who does not have properties that can contain other MetaModels.
    let simpleModel;
    if (newContext.metaModel instanceof MetaModel_1.EnumModel) {
        simpleModel = enumModelFactory(constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.BooleanModel) {
        simpleModel = booleanModelFactory(Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.AnyModel) {
        simpleModel = anyModelFactory(Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.FloatModel) {
        simpleModel = floatModelFactory(Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.IntegerModel) {
        simpleModel = integerModelFactory(Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.StringModel) {
        simpleModel = stringModelFactory(Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    if (simpleModel !== undefined) {
        alreadySeenModels.set(context.metaModel, simpleModel);
        return simpleModel;
    }
    throw new Error('Could not constrain model');
}
exports.metaModelFactory = metaModelFactory;
//# sourceMappingURL=MetaModelToConstrained.js.map