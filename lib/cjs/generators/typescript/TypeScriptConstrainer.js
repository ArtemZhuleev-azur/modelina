"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptDefaultConstraints = exports.TypeScriptDefaultTypeMapping = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
function applyNullable(model, type) {
    if (model.options.isNullable) {
        return `${type} | null`;
    }
    return type;
}
exports.TypeScriptDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'any';
    },
    Float({ constrainedModel }) {
        return applyNullable(constrainedModel, 'number');
    },
    Integer({ constrainedModel }) {
        return applyNullable(constrainedModel, 'number');
    },
    String({ constrainedModel }) {
        return applyNullable(constrainedModel, 'string');
    },
    Boolean({ constrainedModel }) {
        return applyNullable(constrainedModel, 'boolean');
    },
    Tuple({ constrainedModel }) {
        const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
            return constrainedType.value.type;
        });
        const tupleType = `[${tupleTypes.join(', ')}]`;
        return applyNullable(constrainedModel, tupleType);
    },
    Array({ constrainedModel }) {
        let arrayType = constrainedModel.valueModel.type;
        if (constrainedModel.valueModel instanceof models_1.ConstrainedUnionModel) {
            arrayType = `(${arrayType})`;
        }
        arrayType = `${arrayType}[]`;
        return applyNullable(constrainedModel, arrayType);
    },
    Enum({ constrainedModel }) {
        return constrainedModel.name;
    },
    Union(args) {
        const unionTypes = args.constrainedModel.union.map((unionModel) => {
            var _a;
            if ((_a = unionModel.options.const) === null || _a === void 0 ? void 0 : _a.value) {
                return `${unionModel.options.const.value}`;
            }
            return unionModel.type;
        });
        return applyNullable(args.constrainedModel, unionTypes.join(' | '));
    },
    Dictionary({ constrainedModel, options }) {
        let keyType;
        //There is some restrictions on what can be used as keys for dictionaries.
        if (constrainedModel.key instanceof models_1.ConstrainedUnionModel) {
            utils_1.Logger.error('Key for dictionary is not allowed to be union type, falling back to any model.');
            keyType = 'any';
        }
        else {
            keyType = constrainedModel.key.type;
        }
        let dictionaryType;
        switch (options.mapType) {
            case 'indexedObject':
                dictionaryType = `{ [name: ${keyType}]: ${constrainedModel.value.type} }`;
                break;
            case 'record':
                dictionaryType = `Record<${keyType}, ${constrainedModel.value.type}>`;
                break;
            case 'map':
                dictionaryType = `Map<${keyType}, ${constrainedModel.value.type}>`;
                break;
        }
        return applyNullable(constrainedModel, dictionaryType);
    }
};
exports.TypeScriptDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=TypeScriptConstrainer.js.map