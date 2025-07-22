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
exports.DART_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const DartRenderer_1 = require("../DartRenderer");
/**
 * Renderer for Dart's `class` type
 *
 * @extends DartRenderer
 */
class ClassRenderer extends DartRenderer_1.DartRenderer {
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
    // eslint-disable-next-line require-await
    renderAccessors() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [];
            return this.renderBlock(content, 2);
        });
    }
}
exports.ClassRenderer = ClassRenderer;
exports.DART_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property }) {
        return `${property.property.type}? ${property.propertyName};`;
    },
    ctor({ model }) {
        return `${model.name}();`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map