"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoDefaultConstraints = exports.GoDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
exports.GoDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return `${constrainedModel.name}`;
    },
    Any() {
        return 'interface{}';
    },
    Float({ constrainedModel, partOfProperty }) {
        return getType({
            constrainedModel,
            partOfProperty,
            typeWhenNullableOrOptional: '*float64',
            type: 'float64'
        });
    },
    Integer({ constrainedModel, partOfProperty }) {
        return getType({
            constrainedModel,
            partOfProperty,
            typeWhenNullableOrOptional: '*int',
            type: 'int'
        });
    },
    String({ constrainedModel, partOfProperty }) {
        return getType({
            constrainedModel,
            partOfProperty,
            typeWhenNullableOrOptional: '*string',
            type: 'string'
        });
    },
    Boolean({ constrainedModel, partOfProperty }) {
        return getType({
            constrainedModel,
            partOfProperty,
            typeWhenNullableOrOptional: '*bool',
            type: 'bool'
        });
    },
    Tuple() {
        //Because Go have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
        return '[]interface{}';
    },
    Array({ constrainedModel }) {
        return `[]${constrainedModel.valueModel.type}`;
    },
    Enum({ constrainedModel }) {
        return constrainedModel.name;
    },
    Union({ constrainedModel }) {
        //Because Go have no notion of unions (and no custom implementation), we have to render it as any value.
        return constrainedModel.name;
    },
    Dictionary({ constrainedModel }) {
        return `map[${constrainedModel.key.type}]${constrainedModel.value.type}`;
    }
};
function getType({ constrainedModel, partOfProperty, typeWhenNullableOrOptional, type }) {
    const required = partOfProperty ? partOfProperty.required : false;
    if (constrainedModel.options.isNullable && !required) {
        return typeWhenNullableOrOptional;
    }
    return type;
}
exports.GoDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=GoConstrainer.js.map