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
exports.CSHARP_DEFAULT_RECORD_PRESET = exports.RecordRenderer = void 0;
const CSharpRenderer_1 = require("../CSharpRenderer");
const models_1 = require("../../../models");
const change_case_1 = require("change-case");
/**
 * Renderer for CSharp's `struct` type
 *
 * @extends CSharpRenderer
 */
class RecordRenderer extends CSharpRenderer_1.CSharpRenderer {
    defaultSelf() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runAdditionalContentPreset()
            ];
            if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.collectionType) === 'List' ||
                this.model.containsPropertyType(models_1.ConstrainedDictionaryModel)) {
                this.dependencyManager.addDependency('using System.Collections.Generic;');
            }
            return `public partial record ${this.model.name}
{
${this.indent(this.renderBlock(content, 2))}
}`;
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
        return this.runPreset('property', {
            property,
            options: this.options,
            renderer: this
        });
    }
    runGetterPreset(property) {
        return this.runPreset('getter', {
            property,
            options: this.options,
            renderer: this
        });
    }
    runSetterPreset(property) {
        return this.runPreset('setter', {
            property,
            options: this.options,
            renderer: this
        });
    }
}
exports.RecordRenderer = RecordRenderer;
exports.CSHARP_DEFAULT_RECORD_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ renderer, property }) {
        return __awaiter(this, void 0, void 0, function* () {
            const getter = yield renderer.runGetterPreset(property);
            const setter = yield renderer.runSetterPreset(property);
            if (property.property.options.const) {
                return `public const ${property.property.type} ${(0, change_case_1.pascalCase)(property.propertyName)} = ${property.property.options.const.value};`;
            }
            return `public ${property.required ? 'required ' : ''}${property.property.type} ${(0, change_case_1.pascalCase)(property.propertyName)} { ${getter} ${setter} }`;
        });
    },
    getter() {
        return 'get;';
    },
    setter() {
        return 'init;';
    },
    additionalContent() {
        return '';
    }
};
//# sourceMappingURL=RecordRenderer.js.map