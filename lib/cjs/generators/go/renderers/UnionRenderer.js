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
exports.GO_DEFAULT_UNION_PRESET = exports.UnionRenderer = void 0;
const GoRenderer_1 = require("../GoRenderer");
const models_1 = require("../../../models");
const FormatHelpers_1 = require("../../../helpers/FormatHelpers");
const unionIncludesDiscriminator = (model) => {
    return (!!model.options.discriminator &&
        model.union.every((union) => union instanceof models_1.ConstrainedObjectModel ||
            (union instanceof models_1.ConstrainedReferenceModel &&
                union.ref instanceof models_1.ConstrainedObjectModel)));
};
/**
 * Renderer for Go's `struct` type
 *
 * @extends GoRenderer
 */
class UnionRenderer extends GoRenderer_1.GoRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            if (unionIncludesDiscriminator(this.model)) {
                const content = [yield this.runDiscriminatorAccessorPreset()];
                return `type ${this.model.name} interface {
${this.indent(this.renderBlock(content, 2))}
}`;
            }
            const content = [
                yield this.renderFields(),
                yield this.runAdditionalContentPreset()
            ];
            return `type ${this.model.name} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    renderFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this.model.union;
            const content = [];
            for (const field of fields) {
                const renderField = yield this.runFieldPreset(field);
                if (!content.includes(renderField)) {
                    content.push(renderField);
                }
            }
            return this.renderBlock(content);
        });
    }
    runFieldPreset(field) {
        return this.runPreset('field', { field });
    }
    runDiscriminatorAccessorPreset() {
        return this.runPreset('discriminator');
    }
}
exports.UnionRenderer = UnionRenderer;
exports.GO_DEFAULT_UNION_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    field({ field, options }) {
        const fieldType = field.type;
        if (fieldType === 'interface{}') {
            return `${options.unionAnyModelName} ${fieldType}`;
        }
        if (fieldType.includes('map')) {
            return `${options.unionDictModelName} ${fieldType}`;
        }
        if (fieldType.includes('[]')) {
            return `${options.unionArrModelName} ${fieldType}`;
        }
        return `${fieldType}`;
    },
    discriminator({ model }) {
        var _a;
        if (!((_a = model.options.discriminator) === null || _a === void 0 ? void 0 : _a.discriminator)) {
            return '';
        }
        return `Is${FormatHelpers_1.FormatHelpers.toPascalCase(model.name)}${FormatHelpers_1.FormatHelpers.toPascalCase(model.options.discriminator.discriminator)}()`;
    }
};
//# sourceMappingURL=UnionRenderer.js.map