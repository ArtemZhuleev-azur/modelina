"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_DEFAULT_CLASS_PRESET = exports.isDiscriminatorInTree = exports.isDiscriminatorOrDictionary = exports.ClassRenderer = void 0;
const JavaRenderer_1 = require("../JavaRenderer");
const models_1 = require("../../../models");
const helpers_1 = require("../../../helpers");
const JavaConstrainer_1 = require("../JavaConstrainer");
const Constants_1 = require("../../csharp/Constants");
/**
 * Renderer for Java's `class` type
 *
 * @extends JavaRenderer
 */
class ClassRenderer extends JavaRenderer_1.JavaRenderer {
    defaultSelf() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            if (this.model.containsPropertyType(models_1.ConstrainedArrayModel) &&
                ((_a = this.options) === null || _a === void 0 ? void 0 : _a.collectionType) === 'List') {
                this.addCollectionDependencies();
            }
            const useOptional = ((_b = this.options) === null || _b === void 0 ? void 0 : _b.useOptionalForNullableProperties) &&
                this.doesContainOptionalProperties();
            if (useOptional) {
                this.dependencyManager.addDependency('import java.util.Optional;');
                this.dependencyManager.addDependency('import static java.util.Optional.ofNullable;');
            }
            if (this.model.containsPropertyType(models_1.ConstrainedDictionaryModel)) {
                this.dependencyManager.addDependency('import java.util.Map;');
            }
            const abstractType = this.model.options.isExtended ? 'interface' : 'class';
            const parentUnions = this.getParentUnions();
            const extend = (_c = this.model.options.extend) === null || _c === void 0 ? void 0 : _c.filter((extend) => extend.options.isExtended);
            const parents = [...(parentUnions !== null && parentUnions !== void 0 ? parentUnions : []), ...(extend !== null && extend !== void 0 ? extend : [])];
            if (parents.length) {
                for (const i of parents) {
                    this.dependencyManager.addModelDependency(i);
                }
                const inheritanceKeyword = this.model.options.isExtended
                    ? 'extends'
                    : 'implements';
                return `public ${abstractType} ${this.model.name} ${inheritanceKeyword} ${parents.map((i) => i.name).join(', ')} {
${this.indent(this.renderBlock(content, 2))}
}`;
            }
            return `public ${abstractType} ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
    /**
     * Render all the properties for the class.
     */
    renderProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                const rendererProperty = yield this.runPropertyPreset(property);
                content.push(rendererProperty);
            }
            return this.renderBlock(content);
        });
    }
    runPropertyPreset(property) {
        return this.runPreset('property', { property });
    }
    /**
     * Render all the accessors for the properties
     */
    renderAccessors() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                const getter = yield this.runGetterPreset(property);
                const setter = yield this.runSetterPreset(property);
                content.push(this.renderBlock([getter, setter]));
            }
            return this.renderBlock(content, 2);
        });
    }
    runGetterPreset(property) {
        return this.runPreset('getter', { property });
    }
    runSetterPreset(property) {
        return this.runPreset('setter', { property });
    }
    getParentUnions() {
        const parentUnions = [];
        if (!this.model.options.parents) {
            return undefined;
        }
        for (const model of this.model.options.parents) {
            if (model instanceof models_1.ConstrainedUnionModel &&
                !(0, JavaConstrainer_1.unionIncludesBuiltInTypes)(model)) {
                parentUnions.push(model);
            }
        }
        if (!parentUnions.length) {
            return undefined;
        }
        return parentUnions;
    }
    doesContainOptionalProperties() {
        const properties = Object.values(this.model.properties);
        return properties.some((prop) => !prop.required);
    }
    addCollectionDependencies() {
        var _a;
        const properties = Object.values(this.model.properties);
        let needsList = false;
        let needsSet = false;
        for (const prop of properties) {
            const propertyModel = prop.property;
            if (propertyModel instanceof models_1.ConstrainedArrayModel) {
                const isUnique = ((_a = propertyModel.originalInput) === null || _a === void 0 ? void 0 : _a.uniqueItems) === true;
                if (isUnique) {
                    needsSet = true;
                }
                else {
                    needsList = true;
                }
            }
        }
        if (needsList) {
            this.dependencyManager.addDependency('import java.util.List;');
        }
        if (needsSet) {
            this.dependencyManager.addDependency('import java.util.Set;');
        }
    }
}
exports.ClassRenderer = ClassRenderer;
const getOverride = (model, property) => {
    var _a;
    const isOverride = (_a = model.options.extend) === null || _a === void 0 ? void 0 : _a.find((extend) => {
        if (!extend.options.isExtended ||
            property.property instanceof models_1.ConstrainedDictionaryModel) {
            return false;
        }
        if (extend instanceof models_1.ConstrainedObjectModel &&
            extend.properties[property.propertyName]) {
            return true;
        }
        if (extend instanceof models_1.ConstrainedReferenceModel &&
            extend.ref instanceof models_1.ConstrainedObjectModel &&
            extend.ref.properties[property.propertyName]) {
            return true;
        }
    });
    return isOverride ? '@Override\n' : '';
};
const isDiscriminatorOrDictionary = (model, property) => {
    var _a;
    return ((_a = model.options.discriminator) === null || _a === void 0 ? void 0 : _a.discriminator) ===
        property.unconstrainedPropertyName ||
        property.property instanceof models_1.ConstrainedDictionaryModel;
};
exports.isDiscriminatorOrDictionary = isDiscriminatorOrDictionary;
const isDiscriminatorInTree = (model, property) => {
    var _a, _b, _c, _d, _e;
    return (_e = (((_b = (_a = model.options) === null || _a === void 0 ? void 0 : _a.extend) === null || _b === void 0 ? void 0 : _b.some((ext) => {
        var _a, _b;
        return ((_b = (_a = ext === null || ext === void 0 ? void 0 : ext.options) === null || _a === void 0 ? void 0 : _a.discriminator) === null || _b === void 0 ? void 0 : _b.discriminator) ===
            property.unconstrainedPropertyName;
    })) ||
        ((_d = (_c = model.options) === null || _c === void 0 ? void 0 : _c.parents) === null || _d === void 0 ? void 0 : _d.some((parent) => {
            var _a, _b;
            return ((_b = (_a = parent === null || parent === void 0 ? void 0 : parent.options) === null || _a === void 0 ? void 0 : _a.discriminator) === null || _b === void 0 ? void 0 : _b.discriminator) ===
                property.unconstrainedPropertyName;
        })))) !== null && _e !== void 0 ? _e : false;
};
exports.isDiscriminatorInTree = isDiscriminatorInTree;
const isEnumImplementedByConstValue = (model, property) => {
    if (!(0, Constants_1.isEnum)(property)) {
        return false;
    }
    if (!model.options.implementedBy) {
        return false;
    }
    // if the implementedBy property exist in the model options, check if the property exists in the implementedBy model and check if the property is set with a const value
    return model.options.implementedBy.some((implementedBy) => {
        var _a;
        return (implementedBy instanceof models_1.ConstrainedObjectModel &&
            implementedBy.properties[property.propertyName] &&
            ((_a = implementedBy.properties[property.propertyName].property.options.const) === null || _a === void 0 ? void 0 : _a.value));
    });
};
const isEnumOrEnumInExtended = (model, property) => {
    if (!(0, Constants_1.isEnum)(property)) {
        return false;
    }
    if (!model.options.extend) {
        return false;
    }
    return model.options.extend.some((extend) => {
        return (extend instanceof models_1.ConstrainedReferenceModel &&
            extend.ref instanceof models_1.ConstrainedObjectModel &&
            extend.ref.properties[property.propertyName] &&
            (0, Constants_1.isEnum)(extend.ref.properties[property.propertyName]));
    });
};
exports.JAVA_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property, model, options }) {
        var _a, _b;
        if (model.options.isExtended) {
            return '';
        }
        if ((_a = property.property.options.const) === null || _a === void 0 ? void 0 : _a.value) {
            return `private final ${property.property.type} ${property.propertyName} = ${property.property.options.const.value};`;
        }
        if (options.useModelNameAsConstForDiscriminatorProperty &&
            property.unconstrainedPropertyName ===
                ((_b = model.options.discriminator) === null || _b === void 0 ? void 0 : _b.discriminator) &&
            property.property.type === 'String') {
            return `private final ${property.property.type} ${property.propertyName} = "${model.name}";`;
        }
        return `private ${property.property.type} ${property.propertyName};`;
    },
    getter({ property, model, options }) {
        const getterName = `get${helpers_1.FormatHelpers.toPascalCase(property.propertyName)}`;
        const useOptional = options.useOptionalForNullableProperties && !property.required;
        const returnType = useOptional
            ? `Optional<${property.property.type}>`
            : property.property.type;
        const returnValue = useOptional
            ? `ofNullable(this.${property.propertyName})`
            : `this.${property.propertyName}`;
        if (model.options.isExtended) {
            if ((0, exports.isDiscriminatorOrDictionary)(model, property)) {
                return '';
            }
            return `${returnType} ${getterName}();`;
        }
        return `${getOverride(model, property)}public ${returnType} ${getterName}() { return ${returnValue}; }`;
    },
    setter({ property, model }) {
        var _a;
        if ((_a = property.property.options.const) === null || _a === void 0 ? void 0 : _a.value) {
            return '';
        }
        const setterName = helpers_1.FormatHelpers.toPascalCase(property.propertyName);
        if (model.options.isExtended) {
            // don't render setters for discriminator, dictionary properties, or enums that are set with a const value
            if ((0, exports.isDiscriminatorOrDictionary)(model, property) ||
                isEnumImplementedByConstValue(model, property)) {
                return '';
            }
            return `void set${setterName}(${property.property.type} ${property.propertyName});`;
        }
        if ((0, exports.isDiscriminatorInTree)(model, property)) {
            return '';
        }
        // don't render override for enums that are set with a const value
        const override = !isEnumOrEnumInExtended(model, property)
            ? getOverride(model, property)
            : '';
        return `${override}public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map