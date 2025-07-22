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
exports.KOTLIN_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const KotlinRenderer_1 = require("../KotlinRenderer");
/**
 * Renderer for Kotlin's `class` type
 *
 * @extends KotlinRenderer
 */
class ClassRenderer extends KotlinRenderer_1.KotlinRenderer {
    defaultSelf(hasProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            return hasProperties
                ? yield this.defaultWithProperties()
                : `class ${this.model.name} {}`;
        });
    }
    defaultWithProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runAdditionalContentPreset()
            ];
            return `data class ${this.model.name}(
${this.indent(this.renderBlock(content, 2))}
)`;
        });
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
exports.KOTLIN_DEFAULT_CLASS_PRESET = {
    self({ renderer, model }) {
        const hasProperties = Object.keys(model.properties).length > 0;
        return renderer.defaultSelf(hasProperties);
    },
    property({ property }) {
        return `val ${property.propertyName}: ${property.property.type}${property.required ? '' : '? = null'},`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map