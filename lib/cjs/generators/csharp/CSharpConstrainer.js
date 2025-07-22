"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpDefaultConstraints = exports.CSharpDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
function getFullTypeDefinition(typeName, partOfProperty) {
    var _a;
    return ((_a = partOfProperty === null || partOfProperty === void 0 ? void 0 : partOfProperty.required) !== null && _a !== void 0 ? _a : true) ? typeName : `${typeName}?`;
}
const fromEnumValueToType = (enumValueModel) => {
    switch (typeof enumValueModel.value) {
        case 'boolean':
            return 'bool';
        case 'number':
        case 'bigint':
            if (Number.isInteger(enumValueModel.value)) {
                return 'int';
            }
            return 'double';
        case 'string':
            return 'string';
        case 'object':
        default:
            return 'dynamic';
    }
};
exports.CSharpDefaultTypeMapping = {
    Object({ constrainedModel, partOfProperty }) {
        return getFullTypeDefinition(constrainedModel.name, partOfProperty);
    },
    Reference({ constrainedModel, partOfProperty }) {
        return getFullTypeDefinition(constrainedModel.name, partOfProperty);
    },
    Any({ partOfProperty }) {
        return getFullTypeDefinition('dynamic', partOfProperty);
    },
    Float({ partOfProperty }) {
        return getFullTypeDefinition('double', partOfProperty);
    },
    Integer({ constrainedModel, partOfProperty }) {
        switch (constrainedModel.options.format) {
            case 'int64':
                return getFullTypeDefinition('long', partOfProperty);
            default:
                return getFullTypeDefinition('int', partOfProperty);
        }
    },
    String({ constrainedModel, partOfProperty }) {
        switch (constrainedModel.options.format) {
            case 'time':
                return getFullTypeDefinition('System.TimeSpan', partOfProperty);
            case 'date':
                return getFullTypeDefinition('System.DateTime', partOfProperty);
            case 'dateTime':
            case 'date-time':
                return getFullTypeDefinition('System.DateTimeOffset', partOfProperty);
            case 'uuid':
                return getFullTypeDefinition('System.Guid', partOfProperty);
            default:
                return getFullTypeDefinition('string', partOfProperty);
        }
    },
    Boolean({ partOfProperty }) {
        return getFullTypeDefinition('bool', partOfProperty);
    },
    Tuple({ constrainedModel, partOfProperty }) {
        const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
            return constrainedType.value.type;
        });
        return getFullTypeDefinition(`(${tupleTypes.join(', ')})`, partOfProperty);
    },
    Array({ constrainedModel, options, partOfProperty }) {
        const typeString = options.collectionType && options.collectionType === 'List'
            ? `IEnumerable<${constrainedModel.valueModel.type}>`
            : `${constrainedModel.valueModel.type}[]`;
        return getFullTypeDefinition(typeString, partOfProperty);
    },
    Enum({ constrainedModel, partOfProperty }) {
        const typesForValues = new Set();
        for (const value of constrainedModel.values) {
            const typeForValue = fromEnumValueToType(value);
            typesForValues.add(typeForValue);
        }
        // If there exist more then 1 unique type, then default to dynamic
        if (typesForValues.size > 1) {
            return 'dynamic';
        }
        const [typeForValues] = typesForValues;
        return getFullTypeDefinition(typeForValues, partOfProperty);
    },
    Union({ partOfProperty }) {
        //Because renderPrivateType( CSharp , partOfProperty) have no notion of unions (and no custom implementation), we have to render it as any value.
        return getFullTypeDefinition('dynamic', partOfProperty);
    },
    Dictionary({ constrainedModel, partOfProperty }) {
        return getFullTypeDefinition(`Dictionary<${constrainedModel.key.type}, ${constrainedModel.value.type}>`, partOfProperty);
    }
};
exports.CSharpDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=CSharpConstrainer.js.map