"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptDefaultConstraints = exports.JavaScriptDefaultTypeMapping = void 0;
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
exports.JavaScriptDefaultTypeMapping = {
    Object() {
        return '';
    },
    Reference() {
        return '';
    },
    Any() {
        return '';
    },
    Float() {
        return '';
    },
    Integer() {
        return '';
    },
    String() {
        return '';
    },
    Boolean() {
        return '';
    },
    Tuple() {
        return '';
    },
    Array() {
        return '';
    },
    Enum() {
        return '';
    },
    Union() {
        return '';
    },
    Dictionary() {
        return '';
    }
};
exports.JavaScriptDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=JavaScriptConstrainer.js.map