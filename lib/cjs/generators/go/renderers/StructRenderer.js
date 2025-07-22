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
exports.GO_DEFAULT_STRUCT_PRESET = exports.StructRenderer = void 0;
const GoRenderer_1 = require("../GoRenderer");
const models_1 = require("../../../models");
const FormatHelpers_1 = require("../../../helpers/FormatHelpers");
/**
 * Renderer for Go's `struct` type
 *
 * @extends GoRenderer
 */
class StructRenderer extends GoRenderer_1.GoRenderer {
    defaultSelf() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderFields(),
                yield this.runAdditionalContentPreset()
            ];
            let discriminator = '';
            if ((_a = this.model.options.parents) === null || _a === void 0 ? void 0 : _a.length) {
                discriminator = yield this.runDiscriminatorFuncPreset();
            }
            return `type ${this.model.name} struct {
${this.indent(this.renderBlock(content, 2))}
}${discriminator &&
                `

${discriminator}
`}`;
        });
    }
    renderFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this.model.properties || {};
            const content = [];
            for (const field of Object.values(fields)) {
                const renderField = yield this.runFieldPreset(field);
                content.push(renderField);
            }
            return this.renderBlock(content);
        });
    }
    runFieldPreset(field) {
        return this.runPreset('field', { field });
    }
    runDiscriminatorFuncPreset() {
        return this.runPreset('discriminator');
    }
}
exports.StructRenderer = StructRenderer;
exports.GO_DEFAULT_STRUCT_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    field({ field }) {
        let fieldType = field.property.type;
        if (field.property instanceof models_1.ConstrainedReferenceModel &&
            !(field.property.ref instanceof models_1.ConstrainedUnionModel &&
                field.property.ref.options.discriminator)) {
            fieldType = `*${fieldType}`;
        }
        return `${field.propertyName} ${fieldType}`;
    },
    discriminator({ model }) {
        const { parents } = model.options;
        if (!(parents === null || parents === void 0 ? void 0 : parents.length)) {
            return '';
        }
        return parents
            .map((parent) => {
            if (!parent.options.discriminator) {
                return undefined;
            }
            return `func (r ${model.name}) Is${FormatHelpers_1.FormatHelpers.toPascalCase(parent.name)}${FormatHelpers_1.FormatHelpers.toPascalCase(parent.options.discriminator.discriminator)}() {}`;
        })
            .filter((parent) => !!parent)
            .join('\n\n');
    }
};
//# sourceMappingURL=StructRenderer.js.map