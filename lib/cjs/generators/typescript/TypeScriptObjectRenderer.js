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
exports.TypeScriptObjectRenderer = void 0;
const TypeScriptRenderer_1 = require("./TypeScriptRenderer");
/**
 * Common renderer for TypeScript types
 *
 * @extends AbstractRenderer
 */
class TypeScriptObjectRenderer extends TypeScriptRenderer_1.TypeScriptRenderer {
    /**
     * Render all the properties for the model by calling the property preset per property.
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
    renderProperty(property) {
        var _a;
        const requiredProperty = property.required === false ? '?' : '';
        let preRenderedProperty;
        if (this.options.rawPropertyNames &&
            this.options.modelType === 'interface') {
            preRenderedProperty = `'${property.unconstrainedPropertyName}'`;
        }
        else {
            preRenderedProperty = property.propertyName;
        }
        const renderedProperty = `${preRenderedProperty}${requiredProperty}`;
        if ((_a = property.property.options.const) === null || _a === void 0 ? void 0 : _a.value) {
            return `${renderedProperty}: ${property.property.options.const.value}${this.options.modelType === 'class'
                ? ` = ${property.property.options.const.value}`
                : ''};`;
        }
        return `${renderedProperty}: ${property.property.type};`;
    }
    runPropertyPreset(property) {
        return this.runPreset('property', { property });
    }
}
exports.TypeScriptObjectRenderer = TypeScriptObjectRenderer;
//# sourceMappingURL=TypeScriptObjectRenderer.js.map