"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModel = exports.defaultMergingOptions = void 0;
const utils_1 = require("../utils");
exports.defaultMergingOptions = {
    constrictModels: true
};
/**
 * Common internal representation for a model.
 */
class CommonModel {
    /**
     * Takes a deep copy of the input object and converts it to an instance of CommonModel.
     *
     * @param object to transform
     * @returns CommonModel instance of the object
     */
    static toCommonModel(object) {
        const convertedSchema = CommonModel.internalToSchema(object);
        if (convertedSchema instanceof CommonModel) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of CommonModel');
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static internalToSchema(object, seenSchemas = new Map()) {
        // if primitive types return as is
        if (null === object || 'object' !== typeof object) {
            return object;
        }
        if (seenSchemas.has(object)) {
            return seenSchemas.get(object);
        }
        if (object instanceof Array) {
            const copy = [];
            for (let i = 0, len = object.length; i < len; i++) {
                copy[Number(i)] = CommonModel.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new CommonModel();
        seenSchemas.set(object, schema);
        for (const [propName, prop] of Object.entries(object)) {
            if (prop === undefined) {
                continue;
            }
            let copyProp = prop;
            // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
            if (propName !== 'originalInput' && propName !== 'enum') {
                if (propName === 'properties' || propName === 'patternProperties') {
                    copyProp = {};
                    for (const [propName2, prop2] of Object.entries(prop)) {
                        copyProp[String(propName2)] = CommonModel.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = CommonModel.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
    /**
     * Retrieves data from originalInput by given key
     *
     * @param key given key
     * @returns {any}
     */
    getFromOriginalInput(key) {
        const input = this.originalInput || {};
        if (typeof input === 'boolean') {
            return undefined;
        }
        return input[String(key)];
    }
    /**
     * Set the types of the model
     *
     * @param type
     */
    setType(type) {
        if (Array.isArray(type)) {
            if (type.length === 0) {
                this.type = undefined;
                return;
            }
            else if (type.length === 1) {
                this.type = type[0];
                return;
            }
        }
        this.type = type;
    }
    /**
     * Removes type(s) from model type
     *
     * @param types
     */
    removeType(typesToRemove) {
        if (Array.isArray(typesToRemove)) {
            for (const type of typesToRemove) {
                this.removeType(type);
            }
        }
        else if (this.type !== undefined && this.type.includes(typesToRemove)) {
            if (Array.isArray(this.type)) {
                this.setType(this.type.filter((el) => {
                    return el !== typesToRemove;
                }));
            }
            else {
                this.setType(undefined);
            }
        }
    }
    /**
     * Adds types to the existing model types.
     *
     * Makes sure to only keep a single type incase of duplicates.
     *
     * @param types which types we should try and add to the existing output
     */
    addTypes(types) {
        if (Array.isArray(types)) {
            for (const type of types) {
                this.addTypes(type);
            }
        }
        else if (this.type === undefined) {
            this.type = types;
        }
        else if (!Array.isArray(this.type) && this.type !== types) {
            this.type = [this.type, types];
        }
        else if (Array.isArray(this.type) && !this.type.includes(types)) {
            this.type.push(types);
        }
    }
    /**
     * Checks if given property name is required in object
     *
     * @param propertyName given property name
     * @returns {boolean}
     */
    isRequired(propertyName) {
        if (this.required === undefined) {
            return false;
        }
        return this.required.includes(propertyName);
    }
    /**
     * Adds an item to the model.
     *
     * If items already exist the two are merged.
     *
     * @param itemModel
     * @param originalInput corresponding input that got interpreted to this model
     */
    addItem(itemModel, originalInput) {
        if (this.items !== undefined) {
            utils_1.Logger.warn(`While trying to add item to model ${this.$id}, duplicate items found. Merging models together to form a unified item model.`, itemModel, originalInput, this);
            this.items = CommonModel.mergeCommonModels(this.items, itemModel, originalInput);
        }
        else {
            this.items = itemModel;
        }
    }
    /**
     * Adds a tuple to the model.
     *
     * If a item already exist it will be merged.
     *
     * @param tupleModel
     * @param originalInput corresponding input that got interpreted to this model
     * @param index
     */
    addItemTuple(tupleModel, originalInput, index) {
        let modelItems = this.items;
        if (!Array.isArray(modelItems)) {
            utils_1.Logger.warn('Trying to add item tuple to a non-tuple item, will drop existing item model', tupleModel, originalInput, index);
            modelItems = [];
        }
        const existingModelAtIndex = modelItems[Number(index)];
        if (existingModelAtIndex !== undefined) {
            utils_1.Logger.warn('Trying to add item tuple at index ${index} but it was already occupied, merging models', tupleModel, originalInput, index);
            modelItems[Number(index)] = CommonModel.mergeCommonModels(existingModelAtIndex, tupleModel, originalInput);
        }
        else {
            modelItems[Number(index)] = tupleModel;
        }
        this.items = modelItems;
    }
    /**
     * Adds a union model to the model.
     *
     * @param unionModel
     */
    addItemUnion(unionModel) {
        if (Array.isArray(this.union)) {
            this.union.push(unionModel);
        }
        else {
            this.union = [unionModel];
        }
    }
    /**
     * Add enum value to the model.
     *
     * Ensures no duplicates are added.
     *
     * @param enumValue
     */
    addEnum(enumValue) {
        if (this.enum === undefined) {
            this.enum = [];
        }
        if (!this.enum.includes(enumValue)) {
            this.enum.push(enumValue);
        }
    }
    /**
     * Remove enum from model.
     *
     * @param enumValue
     */
    removeEnum(enumsToRemove) {
        if (this.enum === undefined || enumsToRemove === undefined) {
            return;
        }
        if (Array.isArray(enumsToRemove)) {
            for (const enumToRemove of enumsToRemove) {
                this.removeEnum(enumToRemove);
            }
            return;
        }
        const filteredEnums = this.enum.filter((el) => {
            return enumsToRemove !== el;
        });
        if (filteredEnums.length === 0) {
            this.enum = undefined;
        }
        else {
            this.enum = filteredEnums;
        }
    }
    /**
     * Adds a property to the model.
     * If the property already exist the two are merged.
     *
     * @param propertyName
     * @param propertyModel
     * @param originalInput corresponding input that got interpreted to this model
     */
    addProperty(propertyName, propertyModel, originalInput) {
        if (this.properties === undefined) {
            this.properties = {};
        }
        if (this.properties[`${propertyName}`] !== undefined) {
            utils_1.Logger.warn(`While trying to add property to model, duplicate properties found. Merging models together for property ${propertyName}`, propertyModel, originalInput, this);
            this.properties[String(propertyName)] = CommonModel.mergeCommonModels(this.properties[String(propertyName)], propertyModel, originalInput);
        }
        else {
            this.properties[String(propertyName)] = propertyModel;
        }
    }
    /**
     * Adds additionalProperty to the model.
     * If another model already exist the two are merged.
     *
     * @param additionalPropertiesModel
     * @param originalInput corresponding input that got interpreted to this model corresponding input that got interpreted to this model
     */
    addAdditionalProperty(additionalPropertiesModel, originalInput) {
        if (this.additionalProperties !== undefined) {
            utils_1.Logger.warn('While trying to add additionalProperties to model, but it is already present, merging models together', additionalPropertiesModel, originalInput, this);
            this.additionalProperties = CommonModel.mergeCommonModels(this.additionalProperties, additionalPropertiesModel, originalInput);
        }
        else {
            this.additionalProperties = additionalPropertiesModel;
        }
    }
    /**
     * Adds a patternProperty to the model.
     * If the pattern already exist the two models are merged.
     *
     * @param pattern
     * @param patternModel
     * @param originalInput corresponding input that got interpreted to this model
     */
    addPatternProperty(pattern, patternModel, originalInput) {
        if (this.patternProperties === undefined) {
            this.patternProperties = {};
        }
        if (this.patternProperties[`${pattern}`] !== undefined) {
            utils_1.Logger.warn(`While trying to add patternProperty to model, duplicate patterns found. Merging pattern models together for pattern ${pattern}`, patternModel, originalInput, this);
            this.patternProperties[String(pattern)] = CommonModel.mergeCommonModels(this.patternProperties[String(pattern)], patternModel, originalInput);
        }
        else {
            this.patternProperties[String(pattern)] = patternModel;
        }
    }
    /**
     * Adds additionalItems to the model.
     * If another model already exist the two are merged.
     *
     * @param additionalItemsModel
     * @param originalInput corresponding input that got interpreted to this model
     */
    addAdditionalItems(additionalItemsModel, originalInput) {
        if (this.additionalItems !== undefined) {
            utils_1.Logger.warn('While trying to add additionalItems to model, but it is already present, merging models together', additionalItemsModel, originalInput, this);
            this.additionalItems = CommonModel.mergeCommonModels(this.additionalItems, additionalItemsModel, originalInput);
        }
        else {
            this.additionalItems = additionalItemsModel;
        }
    }
    /**
     * Adds another model this model should extend.
     *
     * It is only allowed to extend if the other model have $id and is not already being extended.
     *
     * @param extendedModel
     */
    addExtendedModel(extendedModel) {
        var _a, _b;
        if (extendedModel.$id === undefined ||
            CommonModel.idIncludesAnonymousSchema(extendedModel)) {
            utils_1.Logger.error('Found no $id for allOf model and cannot extend the existing model, this should never happen.', this, extendedModel);
            return;
        }
        if ((_a = this.extend) === null || _a === void 0 ? void 0 : _a.find((commonModel) => commonModel.$id === extendedModel.$id)) {
            utils_1.Logger.info(`${this.$id} model already extends model ${extendedModel.$id}.`, this, extendedModel);
            return;
        }
        this.extend = (_b = this.extend) !== null && _b !== void 0 ? _b : [];
        this.extend.push(extendedModel);
    }
    /**
     * Returns true if the $id of a CommonModel includes anonymous_schema
     *
     * @param commonModel
     */
    static idIncludesAnonymousSchema(commonModel) {
        var _a;
        return (_a = commonModel.$id) === null || _a === void 0 ? void 0 : _a.includes('anonymous_schema');
    }
    /**
     * Merge two common model properties together
     *
     * @param mergeTo
     * @param mergeFrom
     * @param originalInput corresponding input that got interpreted to this model
     * @param alreadyIteratedModels
     */
    static mergeProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels = new Map(), options = exports.defaultMergingOptions) {
        if (!mergeTo.properties) {
            mergeTo.properties = mergeFrom.properties;
            return;
        }
        if (!mergeFrom.properties) {
            return;
        }
        mergeTo.properties = Object.assign({}, mergeTo.properties);
        for (const [propName, propValue] of Object.entries(mergeFrom.properties)) {
            if (!mergeTo.properties[String(propName)]) {
                mergeTo.properties[String(propName)] = propValue;
            }
            else {
                utils_1.Logger.warn(`Found duplicate properties ${propName} for model. Model property from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalInput);
                // takes a deep copy of the mergeTo model if the id of mergeTo is anonymous to avoid carrying over properties to other models
                const mergeToModel = CommonModel.idIncludesAnonymousSchema(mergeTo.properties[String(propName)])
                    ? CommonModel.toCommonModel(mergeTo.properties[String(propName)])
                    : mergeTo.properties[String(propName)];
                const mergedModel = CommonModel.mergeCommonModels(mergeToModel, propValue, originalInput, alreadyIteratedModels, options);
                if (propValue.const) {
                    mergeTo.properties[String(propName)] =
                        CommonModel.toCommonModel(mergedModel);
                    mergeTo.properties[String(propName)].const = propValue.const;
                }
                else {
                    mergeTo.properties[String(propName)] = mergedModel;
                }
            }
        }
    }
    /**
     * Merge two common model additionalProperties together
     *
     * @param mergeTo
     * @param mergeFrom
     * @param originalInput corresponding input that got interpreted to this model
     * @param alreadyIteratedModels
     */
    static mergeAdditionalProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels = new Map(), options = exports.defaultMergingOptions) {
        const mergeToAdditionalProperties = mergeTo.additionalProperties;
        const mergeFromAdditionalProperties = mergeFrom.additionalProperties;
        if (mergeFromAdditionalProperties !== undefined) {
            if (mergeToAdditionalProperties === undefined) {
                mergeTo.additionalProperties = mergeFromAdditionalProperties;
            }
            else {
                utils_1.Logger.warn(`Found duplicate additionalProperties for model. additionalProperties from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalInput);
                mergeTo.additionalProperties = CommonModel.mergeCommonModels(mergeToAdditionalProperties, mergeFromAdditionalProperties, originalInput, alreadyIteratedModels, options);
            }
        }
    }
    /**
     * Merge two common model additionalItems together
     *
     * @param mergeTo
     * @param mergeFrom
     * @param originalInput corresponding input that got interpreted to this model
     * @param alreadyIteratedModels
     */
    static mergeAdditionalItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels = new Map(), options = exports.defaultMergingOptions) {
        const mergeToAdditionalItems = mergeTo.additionalItems;
        const mergeFromAdditionalItems = mergeFrom.additionalItems;
        if (mergeFromAdditionalItems !== undefined) {
            if (mergeToAdditionalItems === undefined) {
                mergeTo.additionalItems = mergeFromAdditionalItems;
            }
            else {
                utils_1.Logger.warn(`Found duplicate additionalItems for model. additionalItems from ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalInput);
                mergeTo.additionalItems = CommonModel.mergeCommonModels(mergeToAdditionalItems, mergeFromAdditionalItems, originalInput, alreadyIteratedModels, options);
            }
        }
    }
    /**
     * Merge items together, prefer tuples over simple array since it is more strict.
     *
     * @param mergeTo
     * @param mergeFrom
     * @param originalInput corresponding input that got interpreted to this model
     * @param alreadyIteratedModels
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static mergeItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels = new Map(), options = exports.defaultMergingOptions) {
        if (mergeFrom.items === undefined) {
            return;
        }
        if (Array.isArray(mergeFrom.items) && mergeFrom.items.length === 0) {
            return;
        }
        if (mergeTo.items === undefined) {
            mergeTo.items = mergeFrom.items;
            return;
        }
        const mergeToItems = mergeTo.items;
        //mergeFrom and mergeTo is not tuple
        if (!Array.isArray(mergeFrom.items) && !Array.isArray(mergeToItems)) {
            mergeTo.items = CommonModel.mergeCommonModels(mergeToItems, mergeFrom.items, originalInput, alreadyIteratedModels, options);
        }
        //mergeFrom and mergeTo is tuple
        if (Array.isArray(mergeFrom.items) && Array.isArray(mergeToItems)) {
            for (const [index, mergeFromTupleModel] of mergeFrom.items.entries()) {
                mergeTo.items[Number(index)] =
                    CommonModel.mergeCommonModels(mergeToItems[Number(index)], mergeFromTupleModel, originalInput, alreadyIteratedModels, options);
            }
        }
        //mergeFrom is a tuple && mergeTo is not, use mergeFrom items (the tuple is prioritized)
        if (Array.isArray(mergeFrom.items) && !Array.isArray(mergeToItems)) {
            mergeTo.items = mergeFrom.items;
        }
        //mergeFrom is not tuple && mergeTo is, do nothing
    }
    /**
     * Merge two common model pattern properties together
     *
     * @param mergeTo
     * @param mergeFrom
     * @param originalInput corresponding input that got interpreted to this model
     * @param alreadyIteratedModels
     */
    static mergePatternProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels = new Map(), options = exports.defaultMergingOptions) {
        const mergeToPatternProperties = mergeTo.patternProperties;
        const mergeFromPatternProperties = mergeFrom.patternProperties;
        if (mergeFromPatternProperties !== undefined) {
            if (mergeToPatternProperties === undefined) {
                mergeTo.patternProperties = mergeFromPatternProperties;
            }
            else {
                for (const [pattern, patternModel] of Object.entries(mergeFromPatternProperties)) {
                    if (mergeToPatternProperties[String(pattern)] !== undefined) {
                        utils_1.Logger.warn(`Found duplicate pattern ${pattern} for model. Model pattern for ${mergeFrom.$id || 'unknown'} merged into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalInput);
                        mergeToPatternProperties[String(pattern)] =
                            CommonModel.mergeCommonModels(mergeToPatternProperties[String(pattern)], patternModel, originalInput, alreadyIteratedModels, options);
                    }
                    else {
                        mergeToPatternProperties[String(pattern)] = patternModel;
                    }
                }
            }
        }
    }
    /**
     * Merge types together
     *
     * @param mergeTo
     * @param mergeFrom
     */
    static mergeTypes(mergeTo, mergeFrom) {
        //Only add the types that do not already exist
        const addToType = (type) => {
            if (mergeTo.type !== undefined && !mergeTo.type.includes(type)) {
                if (Array.isArray(mergeTo.type)) {
                    mergeTo.type.push(type);
                }
                else {
                    mergeTo.type = [mergeTo.type, type];
                }
            }
        };
        if (mergeFrom.type !== undefined) {
            if (mergeTo.type === undefined) {
                mergeTo.type = mergeFrom.type;
            }
            else if (Array.isArray(mergeFrom.type)) {
                for (const type of mergeFrom.type) {
                    addToType(type);
                }
            }
            else {
                addToType(mergeFrom.type);
            }
        }
    }
    /**
     * Only merge if left side is undefined and right side is sat OR both sides are defined
     *
     * @param mergeTo
     * @param mergeFrom
     * @param originalInput corresponding input that got interpreted to this model
     * @param alreadyIteratedModels
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static mergeCommonModels(mergeTo, mergeFrom, originalInput, alreadyIteratedModels = new Map(), options = exports.defaultMergingOptions) {
        if (mergeTo === undefined) {
            return mergeFrom;
        }
        utils_1.Logger.debug(`Merging model ${mergeFrom.$id || 'unknown'} into ${mergeTo.$id || 'unknown'}`, mergeTo, mergeFrom, originalInput);
        if (alreadyIteratedModels.has(mergeFrom)) {
            return alreadyIteratedModels.get(mergeFrom);
        }
        alreadyIteratedModels.set(mergeFrom, mergeTo);
        CommonModel.mergeAdditionalProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels, options);
        CommonModel.mergePatternProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels, options);
        CommonModel.mergeAdditionalItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels, options);
        CommonModel.mergeProperties(mergeTo, mergeFrom, originalInput, alreadyIteratedModels, options);
        CommonModel.mergeItems(mergeTo, mergeFrom, originalInput, alreadyIteratedModels, options);
        CommonModel.mergeTypes(mergeTo, mergeFrom);
        if (mergeFrom.enum !== undefined) {
            mergeTo.enum = [...new Set([...(mergeTo.enum || []), ...mergeFrom.enum])];
        }
        mergeTo.const = mergeTo.const || mergeFrom.const;
        if (mergeFrom.required !== undefined && options.constrictModels === true) {
            mergeTo.required = [
                ...new Set([...(mergeTo.required || []), ...mergeFrom.required])
            ];
        }
        mergeTo.format = mergeTo.format || mergeFrom.format;
        if (CommonModel.idIncludesAnonymousSchema(mergeTo) &&
            !CommonModel.idIncludesAnonymousSchema(mergeFrom)) {
            mergeTo.$id = mergeFrom.$id;
        }
        else {
            mergeTo.$id = mergeTo.$id || mergeFrom.$id;
        }
        mergeTo.extend = mergeTo.extend || mergeFrom.extend;
        mergeTo.originalInput = originalInput;
        return mergeTo;
    }
}
exports.CommonModel = CommonModel;
//# sourceMappingURL=CommonModel.js.map