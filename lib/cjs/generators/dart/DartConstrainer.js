"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartDefaultConstraints = exports.DartDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
exports.DartDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'Object';
    },
    Float() {
        return 'double';
    },
    Integer() {
        return 'int';
    },
    String({ constrainedModel }) {
        var _a;
        const format = (_a = constrainedModel.originalInput) === null || _a === void 0 ? void 0 : _a.format;
        switch (format) {
            case 'date':
                return 'DateTime';
            case 'time':
                return 'DateTime';
            case 'dateTime':
            case 'date-time':
                return 'DateTime';
            case 'string':
            case 'password':
            case 'byte':
                return 'String';
            case 'binary':
                return 'byte[]';
            default:
                return 'String';
        }
    },
    Boolean() {
        return 'bool';
    },
    Tuple({ options }) {
        //Since Dart dont support tuples, lets use the most generic type
        if (options.collectionType && options.collectionType === 'List') {
            return 'List<Object>';
        }
        return 'Object[]';
    },
    Array({ constrainedModel, options }) {
        if (options.collectionType && options.collectionType === 'List') {
            return `List<${constrainedModel.valueModel.type}>`;
        }
        return `${constrainedModel.valueModel.type}[]`;
    },
    Enum({ constrainedModel }) {
        return constrainedModel.name;
    },
    Union() {
        return 'Object';
    },
    Dictionary({ constrainedModel }) {
        return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
    }
};
exports.DartDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=DartConstrainer.js.map