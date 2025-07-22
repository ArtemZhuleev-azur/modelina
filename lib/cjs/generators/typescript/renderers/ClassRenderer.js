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
exports.TS_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const TypeScriptObjectRenderer_1 = require("../TypeScriptObjectRenderer");
/**
 * Renderer for TypeScript's `class` type
 *
 * @extends TypeScriptRenderer
 */
class ClassRenderer extends TypeScriptObjectRenderer_1.TypeScriptObjectRenderer {
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
            const properties = this.model.properties;
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
}
exports.ClassRenderer = ClassRenderer;
exports.TS_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    ctor({ renderer, model }) {
        const properties = model.properties || {};
        const assignments = [];
        const ctorProperties = [];
        for (const [propertyName, property] of Object.entries(properties)) {
            // if const value exists we should not render it in the constructor
            if (property.property.options.const) {
                continue;
            }
            assignments.push(`this._${propertyName} = input.${propertyName};`);
            ctorProperties.push(renderer.renderProperty(property).replace(';', ','));
        }
        return `constructor(input: {
${renderer.indent(renderer.renderBlock(ctorProperties))}
}) {
${renderer.indent(renderer.renderBlock(assignments))}
}`;
    },
    property({ renderer, property }) {
        return `private _${renderer.renderProperty(property)}`;
    },
    getter({ property }) {
        var _a;
        return `get ${property.propertyName}(): ${((_a = property.property.options.const) === null || _a === void 0 ? void 0 : _a.value)
            ? property.property.options.const.value
            : property.property.type}${property.required === false ? ' | undefined' : ''} { return this._${property.propertyName}; }`;
    },
    setter({ property }) {
        var _a;
        // if const value exists we should not render a setter
        if ((_a = property.property.options.const) === null || _a === void 0 ? void 0 : _a.value) {
            return '';
        }
        return `set ${property.propertyName}(${property.propertyName}: ${property.property.type}${property.required === false ? ' | undefined' : ''}) { this._${property.propertyName} = ${property.propertyName}; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map