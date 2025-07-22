"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToTupleModel = exports.convertToArrayModel = exports.convertToObjectModel = exports.convertToDictionaryModel = exports.convertToBooleanModel = exports.convertToEnumModel = exports.convertToFloatModel = exports.convertToIntegerModel = exports.convertToAnyModel = exports.convertToStringModel = exports.convertToUnionModel = exports.convertToMetaModel = void 0;
const utils_1 = require("../utils");
const models_1 = require("../models");
function getMetaModelOptions(commonModel, processorOptions) {
    var _a;
    const options = {};
    if (commonModel.const) {
        options.const = {
            originalInput: commonModel.const
        };
    }
    else if (processorOptions.interpretSingleEnumAsConst &&
        ((_a = commonModel.enum) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        options.const = {
            originalInput: commonModel.enum[0]
        };
    }
    if (Array.isArray(commonModel.type) && commonModel.type.includes('null')) {
        options.isNullable = true;
    }
    else {
        options.isNullable = false;
    }
    if (commonModel.discriminator) {
        options.discriminator = {
            discriminator: commonModel.discriminator
        };
    }
    if (commonModel.format) {
        options.format = commonModel.format;
    }
    return options;
}
function convertToMetaModel(context) {
    const { jsonSchemaModel, alreadySeenModels = new Map(), options } = context;
    const hasModel = alreadySeenModels.has(jsonSchemaModel);
    if (hasModel) {
        return alreadySeenModels.get(jsonSchemaModel);
    }
    const name = jsonSchemaModel.$id || 'undefined';
    const unionModel = convertToUnionModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (unionModel !== undefined) {
        return unionModel;
    }
    const anyModel = convertToAnyModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (anyModel !== undefined) {
        return anyModel;
    }
    const enumModel = convertToEnumModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (enumModel !== undefined) {
        return enumModel;
    }
    const objectModel = convertToObjectModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (objectModel !== undefined) {
        return objectModel;
    }
    const dictionaryModel = convertToDictionaryModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (dictionaryModel !== undefined) {
        return dictionaryModel;
    }
    const tupleModel = convertToTupleModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (tupleModel !== undefined) {
        return tupleModel;
    }
    const arrayModel = convertToArrayModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (arrayModel !== undefined) {
        return arrayModel;
    }
    const stringModel = convertToStringModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (stringModel !== undefined) {
        return stringModel;
    }
    const floatModel = convertToFloatModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (floatModel !== undefined) {
        return floatModel;
    }
    const integerModel = convertToIntegerModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (integerModel !== undefined) {
        return integerModel;
    }
    const booleanModel = convertToBooleanModel(Object.assign(Object.assign({}, context), { alreadySeenModels,
        name }));
    if (booleanModel !== undefined) {
        return booleanModel;
    }
    utils_1.Logger.warn(`Failed to convert ${name} to MetaModel, defaulting to AnyModel`);
    return new models_1.AnyModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options));
}
exports.convertToMetaModel = convertToMetaModel;
function isEnumModel(jsonSchemaModel, interpretSingleEnumAsConst = false) {
    if (!Array.isArray(jsonSchemaModel.enum) ||
        (jsonSchemaModel.enum.length <= 1 && interpretSingleEnumAsConst)) {
        return false;
    }
    return true;
}
function shouldBeAnyType(jsonSchemaModel) {
    const containsAllTypesButNull = Array.isArray(jsonSchemaModel.type) &&
        jsonSchemaModel.type.length >= 6 &&
        !jsonSchemaModel.type.includes('null');
    const containsAllTypes = (Array.isArray(jsonSchemaModel.type) &&
        jsonSchemaModel.type.length === 7) ||
        containsAllTypesButNull;
    return containsAllTypesButNull || containsAllTypes;
}
/**
 * Converts a CommonModel into multiple models wrapped in a union model.
 *
 * Because a CommonModel might contain multiple models, it's name for each of those models would be the same, instead we slightly change the model name.
 * Each model has it's type as a name prepended to the union name.
 *
 * If the CommonModel has multiple types
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function convertToUnionModel(context) {
    var _a;
    const { jsonSchemaModel, alreadySeenModels, options, name } = context;
    const containsUnions = Array.isArray(jsonSchemaModel.union);
    // Should not create union from two types where one is null
    const containsTypeWithNull = Array.isArray(jsonSchemaModel.type) &&
        jsonSchemaModel.type.length === 2 &&
        jsonSchemaModel.type.includes('null');
    const containsSimpleTypeUnion = Array.isArray(jsonSchemaModel.type) &&
        jsonSchemaModel.type.length > 1 &&
        !containsTypeWithNull;
    const isAnyType = shouldBeAnyType(jsonSchemaModel);
    //Lets see whether we should have a union or not.
    if ((!containsSimpleTypeUnion && !containsUnions) ||
        isEnumModel(jsonSchemaModel) ||
        isAnyType ||
        containsTypeWithNull) {
        return undefined;
    }
    const unionModel = new models_1.UnionModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), []);
    //cache model before continuing
    if (!alreadySeenModels.has(jsonSchemaModel)) {
        alreadySeenModels.set(jsonSchemaModel, unionModel);
    }
    // Has multiple types, so convert to union
    if (containsUnions && jsonSchemaModel.union) {
        for (const unionCommonModel of jsonSchemaModel.union) {
            const isSingleNullType = (Array.isArray(unionCommonModel.type) &&
                unionCommonModel.type.length === 1 &&
                ((_a = unionCommonModel.type) === null || _a === void 0 ? void 0 : _a.includes('null'))) ||
                unionCommonModel.type === 'null';
            if (isSingleNullType) {
                unionModel.options.isNullable = true;
            }
            else {
                const unionMetaModel = convertToMetaModel({
                    alreadySeenModels,
                    jsonSchemaModel: unionCommonModel,
                    options
                });
                unionModel.union.push(unionMetaModel);
            }
        }
        return unionModel;
    }
    // Has simple union types
    // Each must have a different name then the root union model, as it otherwise clashes when code is generated
    const enumModel = convertToEnumModel(Object.assign(Object.assign({}, context), { alreadySeenModels, name: `${name}_enum` }));
    if (enumModel !== undefined) {
        unionModel.union.push(enumModel);
    }
    const objectModel = convertToObjectModel(Object.assign(Object.assign({}, context), { alreadySeenModels, name: `${name}_object` }));
    if (objectModel !== undefined) {
        unionModel.union.push(objectModel);
    }
    const dictionaryModel = convertToDictionaryModel(Object.assign(Object.assign({}, context), { alreadySeenModels, name: `${name}_dictionary` }));
    if (dictionaryModel !== undefined) {
        unionModel.union.push(dictionaryModel);
    }
    const tupleModel = convertToTupleModel(Object.assign(Object.assign({}, context), { alreadySeenModels, name: `${name}_tuple` }));
    if (tupleModel !== undefined) {
        unionModel.union.push(tupleModel);
    }
    const arrayModel = convertToArrayModel(Object.assign(Object.assign({}, context), { alreadySeenModels, name: `${name}_array` }));
    if (arrayModel !== undefined) {
        unionModel.union.push(arrayModel);
    }
    const stringModel = convertToStringModel(Object.assign(Object.assign({}, context), { name: `${name}_string` }));
    if (stringModel !== undefined) {
        unionModel.union.push(stringModel);
    }
    const floatModel = convertToFloatModel(Object.assign(Object.assign({}, context), { name: `${name}_float` }));
    if (floatModel !== undefined) {
        unionModel.union.push(floatModel);
    }
    const integerModel = convertToIntegerModel(Object.assign(Object.assign({}, context), { name: `${name}_integer` }));
    if (integerModel !== undefined) {
        unionModel.union.push(integerModel);
    }
    const booleanModel = convertToBooleanModel(Object.assign(Object.assign({}, context), { name: `${name}_boolean` }));
    if (booleanModel !== undefined) {
        unionModel.union.push(booleanModel);
    }
    return unionModel;
}
exports.convertToUnionModel = convertToUnionModel;
function convertToStringModel(context) {
    var _a;
    const { jsonSchemaModel, options, name } = context;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('string'))) {
        return undefined;
    }
    return new models_1.StringModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options));
}
exports.convertToStringModel = convertToStringModel;
function convertToAnyModel(context) {
    var _a;
    const { jsonSchemaModel, options, name } = context;
    const isAnyType = shouldBeAnyType(jsonSchemaModel);
    if (!Array.isArray(jsonSchemaModel.type) || !isAnyType) {
        return undefined;
    }
    let originalInput = jsonSchemaModel.originalInput;
    if (typeof jsonSchemaModel.originalInput !== 'object') {
        originalInput = Object.assign({ value: jsonSchemaModel.originalInput }, (((_a = jsonSchemaModel.originalInput) === null || _a === void 0 ? void 0 : _a.description) !== undefined && {
            description: jsonSchemaModel.originalInput.description
        }));
    }
    return new models_1.AnyModel(name, originalInput, getMetaModelOptions(jsonSchemaModel, options));
}
exports.convertToAnyModel = convertToAnyModel;
function convertToIntegerModel(context) {
    var _a;
    const { jsonSchemaModel, options, name } = context;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('integer'))) {
        return undefined;
    }
    return new models_1.IntegerModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options));
}
exports.convertToIntegerModel = convertToIntegerModel;
function convertToFloatModel(context) {
    var _a;
    const { jsonSchemaModel, options, name } = context;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('number'))) {
        return undefined;
    }
    return new models_1.FloatModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options));
}
exports.convertToFloatModel = convertToFloatModel;
function convertToEnumModel(context) {
    const { jsonSchemaModel, options, name } = context;
    if (!isEnumModel(jsonSchemaModel, options.interpretSingleEnumAsConst)) {
        return undefined;
    }
    const enumValueToEnumValueModel = (enumValue) => {
        if (typeof enumValue !== 'string') {
            return new models_1.EnumValueModel(JSON.stringify(enumValue), enumValue);
        }
        return new models_1.EnumValueModel(enumValue, enumValue);
    };
    const metaModel = new models_1.EnumModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), []);
    if (jsonSchemaModel.enum) {
        for (const enumValue of jsonSchemaModel.enum) {
            metaModel.values.push(enumValueToEnumValueModel(enumValue));
        }
    }
    return metaModel;
}
exports.convertToEnumModel = convertToEnumModel;
function convertToBooleanModel(context) {
    var _a;
    const { jsonSchemaModel, options, name } = context;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('boolean'))) {
        return undefined;
    }
    return new models_1.BooleanModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options));
}
exports.convertToBooleanModel = convertToBooleanModel;
/**
 * Determine whether we have a dictionary or an object. because in some cases inputs might be:
 * { "type": "object", "additionalProperties": { "$ref": "#" } } which is to be interpreted as a dictionary not an object model.
 */
function isDictionary(jsonSchemaModel) {
    if (Object.keys(jsonSchemaModel.properties || {}).length > 0 ||
        jsonSchemaModel.additionalProperties === undefined) {
        return false;
    }
    return true;
}
/**
 * Return the original input based on additionalProperties and patternProperties.
 */
function getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel) {
    const originalInputs = [];
    if (jsonSchemaModel.additionalProperties !== undefined) {
        originalInputs.push(jsonSchemaModel.additionalProperties.originalInput);
    }
    if (jsonSchemaModel.patternProperties !== undefined) {
        for (const patternModel of Object.values(jsonSchemaModel.patternProperties)) {
            originalInputs.push(patternModel.originalInput);
        }
    }
    return originalInputs;
}
/**
 * Function creating the right meta model based on additionalProperties and patternProperties.
 */
function convertAdditionalAndPatterns(context) {
    const { jsonSchemaModel, options, name } = context;
    const modelsAsValue = new Map();
    if (jsonSchemaModel.additionalProperties !== undefined) {
        const additionalPropertyModel = convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: jsonSchemaModel.additionalProperties }));
        modelsAsValue.set(additionalPropertyModel.name, additionalPropertyModel);
    }
    if (jsonSchemaModel.patternProperties !== undefined) {
        for (const patternModel of Object.values(jsonSchemaModel.patternProperties)) {
            const patternPropertyModel = convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: patternModel }));
            modelsAsValue.set(patternPropertyModel.name, patternPropertyModel);
        }
    }
    if (modelsAsValue.size === 1) {
        return Array.from(modelsAsValue.values())[0];
    }
    return new models_1.UnionModel(name, getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel), getMetaModelOptions(jsonSchemaModel, options), Array.from(modelsAsValue.values()));
}
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
function convertToDictionaryModel(context) {
    var _a;
    const { jsonSchemaModel, options, name } = context;
    if (!isDictionary(jsonSchemaModel)) {
        return undefined;
    }
    const originalInput = getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
    const keyModel = new models_1.StringModel(name, originalInput, {});
    const valueModel = convertAdditionalAndPatterns(context);
    const input = Object.assign({ originalInput }, (((_a = jsonSchemaModel.originalInput) === null || _a === void 0 ? void 0 : _a.description) !== undefined && {
        description: jsonSchemaModel.originalInput.description
    }));
    return new models_1.DictionaryModel(name, input, getMetaModelOptions(jsonSchemaModel, options), keyModel, valueModel, 'normal');
}
exports.convertToDictionaryModel = convertToDictionaryModel;
function convertToObjectModel(context) {
    var _a, _b, _c;
    const { jsonSchemaModel, alreadySeenModels, options, name } = context;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('object')) ||
        isDictionary(jsonSchemaModel)) {
        return undefined;
    }
    const metaModel = new models_1.ObjectModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), {});
    //cache model before continuing
    if (!alreadySeenModels.has(jsonSchemaModel)) {
        alreadySeenModels.set(jsonSchemaModel, metaModel);
    }
    for (const [propertyName, prop] of Object.entries(jsonSchemaModel.properties || {})) {
        const isRequired = jsonSchemaModel.isRequired(propertyName);
        const propertyModel = new models_1.ObjectPropertyModel(propertyName, isRequired, convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: prop })));
        metaModel.properties[String(propertyName)] = propertyModel;
    }
    if ((_b = jsonSchemaModel.extend) === null || _b === void 0 ? void 0 : _b.length) {
        metaModel.options.extend = [];
        for (const extend of jsonSchemaModel.extend) {
            metaModel.options.extend.push(convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: extend })));
        }
    }
    if (jsonSchemaModel.additionalProperties !== undefined ||
        jsonSchemaModel.patternProperties !== undefined) {
        let propertyName = (_c = options.propertyNameForAdditionalProperties) !== null && _c !== void 0 ? _c : 'additionalProperties';
        while (metaModel.properties[String(propertyName)] !== undefined) {
            propertyName = `reserved_${propertyName}`;
        }
        const originalInput = getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
        const keyModel = new models_1.StringModel(propertyName, originalInput, getMetaModelOptions(jsonSchemaModel, options));
        const valueModel = convertAdditionalAndPatterns(Object.assign(Object.assign({}, context), { name: propertyName }));
        const dictionaryModel = new models_1.DictionaryModel(propertyName, originalInput, getMetaModelOptions(jsonSchemaModel, options), keyModel, valueModel, 'unwrap');
        const propertyModel = new models_1.ObjectPropertyModel(propertyName, false, dictionaryModel);
        metaModel.properties[String(propertyName)] = propertyModel;
    }
    return metaModel;
}
exports.convertToObjectModel = convertToObjectModel;
function convertToArrayModel(context) {
    var _a;
    const { jsonSchemaModel, alreadySeenModels, options, name } = context;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('array'))) {
        return undefined;
    }
    const isNormalArray = !Array.isArray(jsonSchemaModel.items);
    //items single type = normal array
    //items not sat = normal array, any type
    if (isNormalArray) {
        const placeholderModel = new models_1.AnyModel('', undefined, getMetaModelOptions(jsonSchemaModel, options));
        const metaModel = new models_1.ArrayModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), placeholderModel);
        alreadySeenModels.set(jsonSchemaModel, metaModel);
        if (jsonSchemaModel.items !== undefined) {
            const valueModel = convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: jsonSchemaModel.items }));
            metaModel.valueModel = valueModel;
        }
        return metaModel;
    }
    const valueModel = new models_1.UnionModel('union', jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), []);
    const metaModel = new models_1.ArrayModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), valueModel);
    alreadySeenModels.set(jsonSchemaModel, metaModel);
    if (jsonSchemaModel.items !== undefined) {
        for (const itemModel of Array.isArray(jsonSchemaModel.items)
            ? jsonSchemaModel.items
            : [jsonSchemaModel.items]) {
            const itemsModel = convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: itemModel }));
            valueModel.union.push(itemsModel);
        }
    }
    if (jsonSchemaModel.additionalItems !== undefined) {
        const itemsModel = convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: jsonSchemaModel.additionalItems }));
        valueModel.union.push(itemsModel);
    }
    return metaModel;
}
exports.convertToArrayModel = convertToArrayModel;
function convertToTupleModel(context) {
    var _a;
    const { jsonSchemaModel, alreadySeenModels, options, name } = context;
    const isTuple = ((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('array')) &&
        Array.isArray(jsonSchemaModel.items) &&
        jsonSchemaModel.additionalItems === undefined;
    if (!isTuple) {
        return undefined;
    }
    const items = jsonSchemaModel.items;
    //item multiple types + additionalItems not sat = tuple of item type
    const tupleModel = new models_1.TupleModel(name, jsonSchemaModel.originalInput, getMetaModelOptions(jsonSchemaModel, options), []);
    alreadySeenModels.set(jsonSchemaModel, tupleModel);
    for (let i = 0; i < items.length; i++) {
        const item = items[Number(i)];
        const valueModel = convertToMetaModel(Object.assign(Object.assign({}, context), { jsonSchemaModel: item }));
        const tupleValueModel = new models_1.TupleValueModel(i, valueModel);
        tupleModel.tuple[Number(i)] = tupleValueModel;
    }
    return tupleModel;
}
exports.convertToTupleModel = convertToTupleModel;
//# sourceMappingURL=CommonModelToMetaModel.js.map