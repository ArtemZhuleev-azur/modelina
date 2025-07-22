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
exports.TEMPLATE_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const TemplateRenderer_1 = require("../TemplateRenderer");
const helpers_1 = require("../../../helpers");
/**
 * Renderer for Template's `class` type
 *
 * @extends TemplateRenderer
 */
class ClassRenderer extends TemplateRenderer_1.TemplateRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            return `public class ${this.model.name} {
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
}
exports.ClassRenderer = ClassRenderer;
exports.TEMPLATE_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property }) {
        return `private ${property.property.type} ${property.propertyName};`;
    },
    getter({ property }) {
        const getterName = `get${helpers_1.FormatHelpers.toPascalCase(property.propertyName)}`;
        return `public ${property.property.type} ${getterName}() { return this.${property.propertyName}; }`;
    },
    setter({ property }) {
        const setterName = helpers_1.FormatHelpers.toPascalCase(property.propertyName);
        return `public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map