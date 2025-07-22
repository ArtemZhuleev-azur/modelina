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
exports.JS_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const JavaScriptRenderer_1 = require("../JavaScriptRenderer");
/**
 * Renderer for JavaScript's `class` type
 *
 * @extends JavaScriptRenderer
 */
class ClassRenderer extends JavaScriptRenderer_1.JavaScriptRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            return `class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
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
}
exports.ClassRenderer = ClassRenderer;
exports.JS_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    ctor({ renderer, model }) {
        const properties = model.properties || {};
        const assignments = Object.entries(properties).map(([propertyName, property]) => {
            if (!property.required) {
                return `if (input.hasOwnProperty('${propertyName}')) {
  this.${propertyName} = input.${propertyName};
}`;
            }
            return `this.${propertyName} = input.${propertyName};`;
        });
        const body = renderer.renderBlock(assignments);
        return `constructor(input) {
${renderer.indent(body)}
}`;
    },
    property({ property }) {
        return `${property.propertyName};`;
    },
    getter({ property }) {
        return `get ${property.propertyName}() { return this.${property.propertyName}; }`;
    },
    setter({ property }) {
        return `set ${property.propertyName}(${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map