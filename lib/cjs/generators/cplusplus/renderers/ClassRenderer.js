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
exports.CPLUSPLUS_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const CplusplusRenderer_1 = require("../CplusplusRenderer");
/**
 * Renderer for Cplusplus's `class` type
 *
 * @extends CplusplusRenderer
 */
class ClassRenderer extends CplusplusRenderer_1.CplusplusRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runAdditionalContentPreset()
            ];
            return `struct ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
};`;
        });
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
}
exports.ClassRenderer = ClassRenderer;
exports.CPLUSPLUS_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property }) {
        return `${property.property.type} ${property.propertyName};`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map