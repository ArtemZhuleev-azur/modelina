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
exports.JAVA_DEFAULT_UNION_PRESET = exports.UnionRenderer = void 0;
const JavaRenderer_1 = require("../JavaRenderer");
const helpers_1 = require("../../../helpers");
/**
 * Renderer for Java's `union` type
 *
 * @extends JavaRenderer
 */
class UnionRenderer extends JavaRenderer_1.JavaRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.renderComments(`${this.model.name} represents a union of types: ${this.model.union
                .map((m) => m.type)
                .join(', ')}`);
            const content = [];
            if (this.model.options.discriminator) {
                content.push(yield this.runDiscriminatorGetterPreset());
            }
            content.push(yield this.runAdditionalContentPreset());
            return this.renderBlock([
                doc,
                `public interface ${this.model.name} {`,
                this.indent(this.renderBlock(content)),
                '}'
            ]);
        });
    }
    runDiscriminatorGetterPreset() {
        return this.runPreset('discriminatorGetter');
    }
}
exports.UnionRenderer = UnionRenderer;
const getterName = (sanitizedName, options) => {
    return options.modelType === 'record'
        ? helpers_1.FormatHelpers.toCamelCase(sanitizedName)
        : `get${helpers_1.FormatHelpers.toPascalCase(sanitizedName)}`;
};
exports.JAVA_DEFAULT_UNION_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    discriminatorGetter({ model, options }) {
        var _a;
        if (!((_a = model.options.discriminator) === null || _a === void 0 ? void 0 : _a.type)) {
            return '';
        }
        return `${model.options.discriminator.type} ${getterName(getSanitizedDiscriminatorName(model), options)}();`;
    }
};
function getSanitizedDiscriminatorName(model) {
    return helpers_1.FormatHelpers.replaceSpecialCharacters(model.options.discriminator.discriminator, {
        exclude: [' ', '_'],
        separator: '_'
    });
}
//# sourceMappingURL=UnionRenderer.js.map