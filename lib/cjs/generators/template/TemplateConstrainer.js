"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateDefaultConstraints = exports.TemplateDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
exports.TemplateDefaultTypeMapping = {
    Object({ constrainedModel }) {
        //Returning name here because all object models have been split out
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
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
    Enum({ constrainedModel }) {
        //Returning name here because all enum models have been split out
        return constrainedModel.name;
    },
    Union() {
        return '';
    },
    Dictionary() {
        return '';
    }
};
exports.TemplateDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=TemplateConstrainer.js.map