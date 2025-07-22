"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotlinDefaultConstraints = exports.KotlinDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
function enumFormatToNumberType(enumValueModel, format) {
    switch (format) {
        case 'integer':
        case 'int32':
            return 'Int';
        case 'long':
        case 'int64':
            return 'Long';
        case 'float':
            return 'Float';
        case 'double':
            return 'Double';
        default:
            return Number.isInteger(enumValueModel.value) ? 'Int' : 'Double';
    }
}
function fromEnumValueToKotlinType(enumValueModel, format) {
    switch (typeof enumValueModel.value) {
        case 'boolean':
            return 'Boolean';
        case 'number':
        case 'bigint':
            return enumFormatToNumberType(enumValueModel, format);
        case 'object':
            return 'Any';
        case 'string':
            return 'String';
        default:
            return 'Any';
    }
}
/**
 * Converts union of different number types to the most strict type it can be.
 *
 * int + double = double (long + double, float + double can never happen, otherwise this would be converted to double)
 * int + float = float (long + float can never happen, otherwise this would be the case as well)
 * int + long = long
 *
 * Basically a copy from JavaConstrainer.ts
 */
function interpretUnionValueType(types) {
    if (types.includes('Double')) {
        return 'Double';
    }
    if (types.includes('Float')) {
        return 'Float';
    }
    if (types.includes('Long')) {
        return 'Long';
    }
    return 'Any';
}
exports.KotlinDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'Any';
    },
    Float({ constrainedModel }) {
        return constrainedModel.options.format === 'float' ? 'Float' : 'Double';
    },
    Integer({ constrainedModel }) {
        return constrainedModel.options.format === 'long' ||
            constrainedModel.options.format === 'int64'
            ? 'Long'
            : 'Int';
    },
    String({ constrainedModel }) {
        switch (constrainedModel.options.format) {
            case 'date': {
                return 'java.time.LocalDate';
            }
            case 'time': {
                return 'java.time.OffsetTime';
            }
            case 'dateTime':
            case 'date-time': {
                return 'java.time.OffsetDateTime';
            }
            case 'binary': {
                return 'ByteArray';
            }
            default: {
                return 'String';
            }
        }
    },
    Boolean() {
        return 'Boolean';
    },
    // Since there are not tuples in Kotlin, we have to return a collection of `Any`
    Tuple({ options }) {
        const isList = options.collectionType && options.collectionType === 'List';
        return isList ? 'List<Any>' : 'Array<Any>';
    },
    Array({ constrainedModel, options }) {
        const isList = options.collectionType && options.collectionType === 'List';
        const type = constrainedModel.valueModel.type;
        return isList ? `List<${type}>` : `Array<${type}>`;
    },
    Enum({ constrainedModel }) {
        const valueTypes = constrainedModel.values.map((enumValue) => fromEnumValueToKotlinType(enumValue, constrainedModel.options.format));
        const uniqueTypes = [...new Set(valueTypes)];
        // Enums cannot handle union types, default to a loose type
        return uniqueTypes.length > 1
            ? interpretUnionValueType(uniqueTypes)
            : uniqueTypes[0];
    },
    Union() {
        // No Unions in Kotlin, use Any for now.
        return 'Any';
    },
    Dictionary({ constrainedModel }) {
        return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
    }
};
exports.KotlinDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=KotlinConstrainer.js.map