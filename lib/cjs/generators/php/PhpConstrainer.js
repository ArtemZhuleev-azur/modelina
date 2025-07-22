"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhpDefaultConstraints = exports.PhpDefaultTypeMapping = void 0;
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
exports.PhpDefaultTypeMapping = {
    Object({ constrainedModel }) {
        //Returning name here because all object models have been split out
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'mixed';
    },
    Float() {
        return 'float';
    },
    Integer() {
        return 'int';
    },
    String() {
        return 'string';
    },
    Boolean() {
        return 'bool';
    },
    Tuple() {
        return 'mixed';
    },
    Array() {
        return 'array';
    },
    Enum({ constrainedModel }) {
        //Returning name here because all enum models have been split out
        return constrainedModel.name;
    },
    Union() {
        return 'mixed';
    },
    Dictionary() {
        return 'mixed';
    }
};
exports.PhpDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=PhpConstrainer.js.map