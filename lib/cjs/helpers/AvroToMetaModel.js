"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toArrayModel = exports.toObjectModel = exports.toUnionModel = exports.toEnumModel = exports.toStringModel = exports.toFloatModel = exports.toIntegerModel = exports.toBooleanModel = exports.AvroToMetaModel = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
function getMetaModelOptions(AvroModel) {
    var _a;
    const options = {};
    if (Array.isArray(AvroModel.type) && ((_a = AvroModel.type) === null || _a === void 0 ? void 0 : _a.includes('null'))) {
        options.isNullable = true;
    }
    else {
        options.isNullable = false;
    }
    return options;
}
function shouldBeAnyType(avroSchemaModel) {
    // check the type array for the any type
    const containsAllTypesButNotNull = Array.isArray(avroSchemaModel.type) &&
        avroSchemaModel.type.length >= 8 &&
        !avroSchemaModel.type.includes('null');
    const containsAllTypes = Array.isArray(avroSchemaModel.type) && avroSchemaModel.type.length === 10;
    return containsAllTypesButNotNull || containsAllTypes;
}
function AvroToMetaModel(avroSchemaModel, alreadySeenModels = new Map()) {
    const hasModel = alreadySeenModels.has(avroSchemaModel);
    if (hasModel) {
        return alreadySeenModels.get(avroSchemaModel);
    }
    const modelName = (avroSchemaModel === null || avroSchemaModel === void 0 ? void 0 : avroSchemaModel.name) || 'undefined';
    if (shouldBeAnyType(avroSchemaModel)) {
        return new models_1.AnyModel(modelName, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel));
    }
    if (avroSchemaModel.type &&
        !Array.isArray(avroSchemaModel.type) &&
        typeof avroSchemaModel.type !== 'string') {
        return AvroToMetaModel(avroSchemaModel.type, alreadySeenModels);
    }
    const objectModel = toObjectModel(avroSchemaModel, modelName, alreadySeenModels);
    if (objectModel !== undefined) {
        return objectModel;
    }
    const arrayModel = toArrayModel(avroSchemaModel, modelName, alreadySeenModels);
    if (arrayModel !== undefined) {
        return arrayModel;
    }
    const booleanModel = toBooleanModel(avroSchemaModel, modelName);
    if (booleanModel !== undefined) {
        return booleanModel;
    }
    const stringModel = toStringModel(avroSchemaModel, modelName);
    if (stringModel !== undefined) {
        return stringModel;
    }
    const integerModel = toIntegerModel(avroSchemaModel, modelName);
    if (integerModel !== undefined) {
        return integerModel;
    }
    const floatModel = toFloatModel(avroSchemaModel, modelName);
    if (floatModel !== undefined) {
        return floatModel;
    }
    const enumModel = toEnumModel(avroSchemaModel, modelName);
    if (enumModel !== undefined) {
        return enumModel;
    }
    const unionModel = toUnionModel(avroSchemaModel, modelName, alreadySeenModels);
    if (unionModel !== undefined) {
        return unionModel;
    }
    utils_1.Logger.warn('Failed to convert to MetaModel, defaulting to AnyModel.');
    return new models_1.AnyModel(modelName, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel));
}
exports.AvroToMetaModel = AvroToMetaModel;
function toBooleanModel(avroSchemaModel, name) {
    if ((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        avroSchemaModel.type.includes('boolean')) {
        return new models_1.BooleanModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel));
    }
    return undefined;
}
exports.toBooleanModel = toBooleanModel;
function toIntegerModel(avroSchemaModel, name) {
    if ((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        (avroSchemaModel.type.includes('int') ||
            avroSchemaModel.type.includes('long'))) {
        return new models_1.IntegerModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel));
    }
    return undefined;
}
exports.toIntegerModel = toIntegerModel;
function toFloatModel(avroSchemaModel, name) {
    if ((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        (avroSchemaModel.type.includes('float') ||
            avroSchemaModel.type.includes('double'))) {
        return new models_1.FloatModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel));
    }
    return undefined;
}
exports.toFloatModel = toFloatModel;
function toStringModel(avroSchemaModel, name) {
    if ((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        avroSchemaModel.type.includes('string')) {
        return new models_1.StringModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel));
    }
    return undefined;
}
exports.toStringModel = toStringModel;
function toEnumModel(avroSchemaModel, name) {
    if (((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        avroSchemaModel.type.includes('enum')) ||
        Array.isArray(avroSchemaModel.symbols)) {
        const enumValueToEnumValueModel = (enumValue) => {
            if (typeof enumValue !== 'string') {
                return new models_1.EnumValueModel(JSON.stringify(enumValue), enumValue);
            }
            return new models_1.EnumValueModel(enumValue, enumValue);
        };
        const metaModel = new models_1.EnumModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel), []);
        if (avroSchemaModel.symbols) {
            for (const enumValue of avroSchemaModel.symbols) {
                metaModel.values.push(enumValueToEnumValueModel(enumValue));
            }
        }
        return metaModel;
    }
    return undefined;
}
exports.toEnumModel = toEnumModel;
function toUnionModel(avroSchemaModel, name, alreadySeenModels) {
    if (!Array.isArray(avroSchemaModel.type)) {
        return undefined;
    }
    // Should not create union from two types where one is null, i.e, true for ['string', 'null']
    const containsTypeWithNull = Array.isArray(avroSchemaModel.type) &&
        avroSchemaModel.type.length === 2 &&
        avroSchemaModel.type.includes('null');
    if (containsTypeWithNull) {
        return undefined;
    }
    // type: ['string', 'int']
    const unionModel = new models_1.UnionModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel), []);
    //cache model before continuing
    if (!alreadySeenModels.has(avroSchemaModel)) {
        alreadySeenModels.set(avroSchemaModel, unionModel);
    }
    // Has simple union types
    // Each must have a different name then the root union model, as it otherwise clashes when code is generated
    const enumModel = toEnumModel(avroSchemaModel, `${name}_enum`);
    if (enumModel !== undefined) {
        unionModel.union.push(enumModel);
    }
    const objectModel = toObjectModel(avroSchemaModel, `${name}_object`, alreadySeenModels);
    if (objectModel !== undefined) {
        unionModel.union.push(objectModel);
    }
    const arrayModel = toArrayModel(avroSchemaModel, `${name}_array`, alreadySeenModels);
    if (arrayModel !== undefined) {
        unionModel.union.push(arrayModel);
    }
    const stringModel = toStringModel(avroSchemaModel, `${name}_string`);
    if (stringModel !== undefined) {
        unionModel.union.push(stringModel);
    }
    const floatModel = toFloatModel(avroSchemaModel, `${name}_float`);
    if (floatModel !== undefined) {
        unionModel.union.push(floatModel);
    }
    const integerModel = toIntegerModel(avroSchemaModel, `${name}_integer`);
    if (integerModel !== undefined) {
        unionModel.union.push(integerModel);
    }
    const booleanModel = toBooleanModel(avroSchemaModel, `${name}_boolean`);
    if (booleanModel !== undefined) {
        unionModel.union.push(booleanModel);
    }
    return unionModel;
}
exports.toUnionModel = toUnionModel;
function toObjectModel(avroSchemaModel, name, alreadySeenModels) {
    var _a;
    if ((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        avroSchemaModel.type.includes('record')) {
        const metaModel = new models_1.ObjectModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel), {});
        // cache model before continuing
        if (!alreadySeenModels.has(avroSchemaModel)) {
            alreadySeenModels.set(avroSchemaModel, metaModel);
        }
        // fields: a required attribute of record and a JSON Array of JSON Objects
        for (const prop of (avroSchemaModel === null || avroSchemaModel === void 0 ? void 0 : avroSchemaModel.fields) || []) {
            const propertyModel = new models_1.ObjectPropertyModel((_a = prop.name) !== null && _a !== void 0 ? _a : '', true, AvroToMetaModel(prop, alreadySeenModels));
            metaModel.properties[String(prop.name)] = propertyModel;
        }
        return metaModel;
    }
    return undefined;
}
exports.toObjectModel = toObjectModel;
function toArrayModel(avroSchemaModel, name, alreadySeenModels) {
    var _a;
    if ((typeof avroSchemaModel.type === 'string' ||
        Array.isArray(avroSchemaModel.type)) &&
        ((_a = avroSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('array'))) {
        const placeholderModel = new models_1.AnyModel('', undefined, getMetaModelOptions(avroSchemaModel));
        const metaModel = new models_1.ArrayModel(name, avroSchemaModel.originalInput, getMetaModelOptions(avroSchemaModel), placeholderModel);
        alreadySeenModels.set(avroSchemaModel, metaModel);
        if (avroSchemaModel.items !== undefined) {
            const AvroModel = new models_1.AvroSchema();
            AvroModel.name = `${name}_${avroSchemaModel.items}`;
            AvroModel.type = avroSchemaModel.items;
            const valueModel = AvroToMetaModel(AvroModel, alreadySeenModels);
            metaModel.valueModel = valueModel;
        }
        return metaModel;
    }
    return undefined;
}
exports.toArrayModel = toArrayModel;
//# sourceMappingURL=AvroToMetaModel.js.map