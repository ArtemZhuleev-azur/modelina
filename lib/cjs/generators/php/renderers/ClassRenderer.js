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
exports.PHP_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const PhpRenderer_1 = require("../PhpRenderer");
const helpers_1 = require("../../../helpers");
/**
 * Renderer for PHP's `class` type
 *
 * @extends PhpRenderer
 */
class ClassRenderer extends PhpRenderer_1.PhpRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            return `final class ${this.model.name}
{
${this.indent(this.renderBlock(content, 2))}
}
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
}
exports.ClassRenderer = ClassRenderer;
exports.PHP_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property }) {
        const propertyType = property.required || property.property.type === 'mixed'
            ? property.property.type
            : `?${property.property.type}`;
        return `private ${propertyType} $${property.propertyName};`;
    },
    getter({ property }) {
        const getterName = helpers_1.FormatHelpers.toPascalCase(property.propertyName);
        const propertyType = property.required || property.property.type === 'mixed'
            ? property.property.type
            : `?${property.property.type}`;
        return `public function get${getterName}(): ${propertyType} { return $this->${property.propertyName}; }`;
    },
    setter({ property }) {
        const setterName = helpers_1.FormatHelpers.toPascalCase(property.propertyName);
        const propertyType = property.required || property.property.type === 'mixed'
            ? property.property.type
            : `?${property.property.type}`;
        return `public function set${setterName}(${propertyType} $${property.propertyName}): void { $this->${property.propertyName} = $${property.propertyName}; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map