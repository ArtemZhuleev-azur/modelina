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
exports.PYTHON_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const PythonRenderer_1 = require("../PythonRenderer");
const models_1 = require("../../../models");
/**
 * Renderer for Python's `class` type
 *
 * @extends PythonRenderer
 */
class ClassRenderer extends PythonRenderer_1.PythonRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            this.dependencyManager.addDependency('from __future__ import annotations');
            return `class ${this.model.name}: 
${this.indent(this.renderBlock(content, 2))}
`;
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
    /**
     * Self-referencing property types should not use the default constrained `type`, instead it should use the type as is.
     *
     * We cant change the default type, because we dont have access to "parents" of a model.
     */
    renderPropertyType({ modelType, propertyType }) {
        // Use forward references for getters and setters
        return propertyType.replaceAll(`${modelType}.${modelType}`, `${modelType}`);
    }
}
exports.ClassRenderer = ClassRenderer;
exports.PYTHON_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    ctor({ renderer, model }) {
        const properties = model.properties || {};
        let body = '';
        if (Object.keys(properties).length > 0) {
            const assignments = Object.values(properties).map((property) => {
                const propertyType = renderer.renderPropertyType({
                    modelType: model.type,
                    propertyType: property.property.type
                });
                if (property.property.options.const) {
                    return `self._${property.propertyName}: ${propertyType} = ${property.property.options.const.value}`;
                }
                let assignment;
                if (property.property instanceof models_1.ConstrainedReferenceModel) {
                    assignment = `self._${property.propertyName}: ${propertyType} = ${propertyType}(input['${property.propertyName}'])`;
                }
                else {
                    assignment = `self._${property.propertyName}: ${propertyType} = input['${property.propertyName}']`;
                }
                if (!property.required) {
                    return `if '${property.propertyName}' in input:
${renderer.indent(assignment, 2)}`;
                }
                return assignment;
            });
            body = renderer.renderBlock(assignments);
        }
        else {
            body = `"""
No properties
"""`;
        }
        renderer.dependencyManager.addDependency(`from typing import Dict`);
        return `def __init__(self, input: Dict):
${renderer.indent(body, 2)}`;
    },
    getter({ property, renderer, model }) {
        const propertyType = renderer.renderPropertyType({
            modelType: model.type,
            propertyType: property.property.type
        });
        const propAssignment = `return self._${property.propertyName}`;
        return `@property
def ${property.propertyName}(self) -> ${propertyType}:
${renderer.indent(propAssignment, 2)}`;
    },
    setter({ property, renderer, model }) {
        var _a;
        // if const value exists we should not render a setter
        if ((_a = property.property.options.const) === null || _a === void 0 ? void 0 : _a.value) {
            return '';
        }
        const propertyType = renderer.renderPropertyType({
            modelType: model.type,
            propertyType: property.property.type
        });
        const propAssignment = `self._${property.propertyName} = ${property.propertyName}`;
        const propArgument = `${property.propertyName}: ${propertyType}`;
        return `@${property.propertyName}.setter
def ${property.propertyName}(self, ${propArgument}):
${renderer.indent(propAssignment, 2)}`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map