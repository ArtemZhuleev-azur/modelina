"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CplusplusDefaultConstraints = exports.CplusplusDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
function ensureOptional(type, partOfProperty, dependencyManager) {
    if (partOfProperty !== undefined && partOfProperty.required !== true) {
        dependencyManager.addDependency('#include <optional>');
        return `std::optional<${type}>`;
    }
    return type;
}
exports.CplusplusDefaultTypeMapping = {
    Object({ constrainedModel, options, partOfProperty, dependencyManager }) {
        const type = `${options.namespace}::${constrainedModel.name}`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Reference({ constrainedModel, options, partOfProperty, dependencyManager }) {
        const type = `${options.namespace}::${constrainedModel.name}`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Any({ partOfProperty, dependencyManager }) {
        dependencyManager.addDependency('#include <any>');
        const type = 'std::any';
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Float({ partOfProperty, dependencyManager }) {
        const type = 'double';
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Integer({ partOfProperty, dependencyManager }) {
        const type = 'int';
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    String({ dependencyManager, partOfProperty }) {
        dependencyManager.addDependency('#include <string>');
        const type = 'std::string';
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Boolean({ partOfProperty, dependencyManager }) {
        const type = 'bool';
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Tuple({ constrainedModel, dependencyManager, partOfProperty }) {
        const types = constrainedModel.tuple.map((model) => {
            return model.value.type;
        });
        dependencyManager.addDependency('#include <tuple>');
        const type = `std::tuple<${types.join(', ')}>`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Array({ constrainedModel, dependencyManager, partOfProperty }) {
        dependencyManager.addDependency('#include <vector>');
        const type = `std::vector<${constrainedModel.valueModel.type}>`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Enum({ constrainedModel, options, partOfProperty, dependencyManager }) {
        //Returning name here because all enum models have been split out
        const type = `${options.namespace}::${constrainedModel.name}`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Union({ constrainedModel, dependencyManager, partOfProperty }) {
        const types = constrainedModel.union.map((model) => {
            return model.type;
        });
        dependencyManager.addDependency('#include <variant>');
        const type = `std::variant<${types.join(', ')}>`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    },
    Dictionary({ constrainedModel, dependencyManager, partOfProperty }) {
        dependencyManager.addDependency('#include <map>');
        const type = `std::map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
        return ensureOptional(type, partOfProperty, dependencyManager);
    }
};
exports.CplusplusDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=CplusplusConstrainer.js.map