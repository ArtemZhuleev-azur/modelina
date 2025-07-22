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
exports.CSHARP_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const CSharpRenderer_1 = require("../CSharpRenderer");
const models_1 = require("../../../models");
/**
 * Renderer for CSharp's `struct` type
 *
 * @extends CSharpRenderer
 */
class ClassRenderer extends CSharpRenderer_1.CSharpRenderer {
    defaultSelf() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.collectionType) === 'List' ||
                this.model.containsPropertyType(models_1.ConstrainedDictionaryModel)) {
                this.dependencyManager.addDependency('using System.Collections.Generic;');
            }
            return `public partial class ${this.model.name}
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
    renderAccessors() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                content.push(yield this.runAccessorPreset(property));
            }
            return this.renderBlock(content, 2);
        });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
    runAccessorPreset(property) {
        return this.runPreset('accessor', {
            property,
            options: this.options,
            renderer: this
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
exports.ClassRenderer = ClassRenderer;
exports.CSHARP_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ renderer, property, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (property.propertyName === 'additionalProperties' &&
                property.property instanceof models_1.ConstrainedDictionaryModel) {
                return '';
            }
            let nullablePropertyEnding = '';
            // if (
            //   options?.handleNullable &&
            //   property.required &&
            //   !isPrimitive(property) &&
            //   !isEnum(property) &&
            //   !isStringRenderingType(property)
            // ) {
            //   nullablePropertyEnding = ' = null!';
            // }
            // if (options?.autoImplementedProperties) {
            //   const getter = await renderer.runGetterPreset(property);
            //   const setter = await renderer.runSetterPreset(property);
            //   if (property.property.options.const) {
            //     return `public const ${property.property.type} ${pascalCase(
            //       property.propertyName
            //     )} { ${getter} } = ${property.property.options.const.value};`;
            //   }
            //   const semiColon = nullablePropertyEnding !== '' ? ';' : '';
            //   return `public ${property.property.type} ${pascalCase(
            //     property.propertyName
            //   )} { ${getter} ${setter} }${nullablePropertyEnding}${semiColon}`;
            // }
            // if (property.property.options.const) {
            //   return `private const ${property.property.type} ${property.propertyName} = ${property.property.options.const.value};`;
            // }
            return `public ${property.property.type} ${property.propertyName}${nullablePropertyEnding};`;
        });
    },
    //   async accessor({ renderer, options, property }) {
    //     const formattedAccessorName = pascalCase(property.propertyName);
    //     if (options?.autoImplementedProperties) {
    //       return '';
    //     }
    //     if (property.property.options.const) {
    //       return `public ${property.property.type} ${formattedAccessorName} 
    // {
    //   ${await renderer.runGetterPreset(property)}
    // }`;
    //     }
    //     return `public ${property.property.type} ${formattedAccessorName} 
    // {
    //   ${await renderer.runGetterPreset(property)}
    //   ${await renderer.runSetterPreset(property)}
    // }`;
    // }
    // getter({ options, property }) {
    //   if (options?.autoImplementedProperties) {
    //     return 'get;';
    //   }
    //   return `get { return ${property.propertyName}; }`;
    // },
    // setter({ options, property }) {
    //   if (options?.autoImplementedProperties) {
    //     return 'set;';
    //   }
    //   return `set { this.${property.propertyName} = value; }`;
    // }
};
//# sourceMappingURL=ClassRenderer.js.map