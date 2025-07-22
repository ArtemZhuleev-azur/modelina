"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaDefaultConstraints = exports.JavaDefaultTypeMapping = exports.unionIncludesBuiltInTypes = void 0;
const models_1 = require("../../models");
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
function enumFormatToNumberType(enumValueModel, format) {
    switch (format) {
        case 'integer':
        case 'int32':
            return 'int';
        case 'long':
        case 'int64':
            return 'long';
        case 'float':
            return 'float';
        case 'double':
            return 'double';
        default:
            if (Number.isInteger(enumValueModel.value)) {
                return 'int';
            }
            return 'double';
    }
}
const fromEnumValueToType = (enumValueModel, format) => {
    switch (typeof enumValueModel.value) {
        case 'boolean':
            return 'boolean';
        case 'number':
        case 'bigint':
            return enumFormatToNumberType(enumValueModel, format);
        case 'object':
            return 'Object';
        case 'string':
            return 'String';
        default:
            return 'Object';
    }
};
/**
 * Converts union of different number types to the most strict type it can be.
 *
 * int + double = double (long + double, float + double can never happen, otherwise this would be converted to double)
 * int + float = float (long + float can never happen, otherwise this would be the case as well)
 * int + long = long
 */
const interpretUnionValueType = (types) => {
    if (types.includes('double')) {
        return 'double';
    }
    if (types.includes('float')) {
        return 'float';
    }
    if (types.includes('long')) {
        return 'long';
    }
    return 'Object';
};
function unionIncludesBuiltInTypes(model) {
    return !model.union.every((union) => union instanceof models_1.ConstrainedObjectModel ||
        (union instanceof models_1.ConstrainedReferenceModel &&
            union.ref instanceof models_1.ConstrainedObjectModel));
}
exports.unionIncludesBuiltInTypes = unionIncludesBuiltInTypes;
function getType({ constrainedModel, partOfProperty, typeWhenNullableOrOptional, type }) {
    if (constrainedModel.options.isNullable || !(partOfProperty === null || partOfProperty === void 0 ? void 0 : partOfProperty.required)) {
        return typeWhenNullableOrOptional;
    }
    return type;
}
exports.JavaDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        if (constrainedModel.ref instanceof models_1.ConstrainedUnionModel &&
            unionIncludesBuiltInTypes(constrainedModel.ref)) {
            //We only have partial strong typed support for union models
            //Use object if the union includes built-in Java types
            return 'Object';
        }
        return constrainedModel.name;
    },
    Any() {
        return 'Object';
    },
    Float({ constrainedModel, partOfProperty }) {
        switch (constrainedModel.options.format) {
            case 'float':
                return getType({
                    constrainedModel,
                    partOfProperty,
                    typeWhenNullableOrOptional: 'Float',
                    type: 'float'
                });
            default:
                return getType({
                    constrainedModel,
                    partOfProperty,
                    typeWhenNullableOrOptional: 'Double',
                    type: 'double'
                });
        }
    },
    Integer({ constrainedModel, partOfProperty }) {
        const type = getType({
            constrainedModel,
            partOfProperty,
            typeWhenNullableOrOptional: 'Integer',
            type: 'int'
        });
        switch (constrainedModel.options.format) {
            case 'integer':
            case 'int32':
                return type;
            case 'long':
            case 'int64':
                return getType({
                    constrainedModel,
                    partOfProperty,
                    typeWhenNullableOrOptional: 'Long',
                    type: 'long'
                });
            default:
                return type;
        }
    },
    String({ constrainedModel }) {
        switch (constrainedModel.options.format) {
            case 'date':
                return 'java.time.LocalDate';
            case 'time':
                return 'java.time.OffsetTime';
            case 'dateTime':
            case 'date-time':
                return 'java.time.OffsetDateTime';
            case 'duration':
                return 'java.time.Duration';
            case 'binary':
                return 'byte[]';
            default:
                return 'String';
        }
    },
    Boolean({ constrainedModel, partOfProperty }) {
        return getType({
            constrainedModel,
            partOfProperty,
            typeWhenNullableOrOptional: 'Boolean',
            type: 'boolean'
        });
    },
    Tuple({ options, dependencyManager }) {
        //Because Java have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
        const tupleType = 'Object';
        if (options.collectionType && options.collectionType === 'List') {
            dependencyManager.addDependency('import java.util.List;');
            return `List<${tupleType}>`;
        }
        return `${tupleType}[]`;
    },
    Array({ constrainedModel, options, dependencyManager }) {
        var _a;
        const isUnique = ((_a = constrainedModel.originalInput) === null || _a === void 0 ? void 0 : _a.uniqueItems) === true;
        if (options.collectionType === 'List' && !isUnique) {
            dependencyManager.addDependency('import java.util.List;');
            return `List<${constrainedModel.valueModel.type}>`;
        }
        if (isUnique) {
            dependencyManager.addDependency('import java.util.Set;');
            return `Set<${constrainedModel.valueModel.type}>`;
        }
        return `${constrainedModel.valueModel.type}[]`;
    },
    Enum({ constrainedModel }) {
        const valueTypes = constrainedModel.values.map((enumValue) => fromEnumValueToType(enumValue, constrainedModel.options.format));
        const uniqueTypes = valueTypes.filter((item, pos) => {
            return valueTypes.indexOf(item) === pos;
        });
        //Enums cannot handle union types, default to a loose type
        if (uniqueTypes.length > 1) {
            return interpretUnionValueType(uniqueTypes);
        }
        return uniqueTypes[0];
    },
    Union({ constrainedModel }) {
        if (unionIncludesBuiltInTypes(constrainedModel)) {
            //We only have partial strong typed support for union models
            //Use object if the union includes built-in Java types
            return 'Object';
        }
        return constrainedModel.name;
    },
    Dictionary({ constrainedModel, dependencyManager }) {
        //Limitations to Java is that maps cannot have specific value types...
        if (constrainedModel.value.type === 'int') {
            constrainedModel.value.type = 'Integer';
        }
        dependencyManager.addDependency('import java.util.Map;');
        return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
    }
};
exports.JavaDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=JavaConstrainer.js.map