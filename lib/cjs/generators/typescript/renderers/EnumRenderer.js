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
exports.TS_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const TypeScriptRenderer_1 = require("../TypeScriptRenderer");
const models_1 = require("../../../models");
/**
 * Renderer for TypeScript's `enum` type
 *
 * @extends TypeScriptRenderer
 */
class EnumRenderer extends TypeScriptRenderer_1.TypeScriptRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
                yield this.runAdditionalContentPreset()
            ];
            return `enum ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    renderUnionEnum(model) {
        const enums = model.values || [];
        const enumTypes = enums.map((t) => t.value).join(' | ');
        return `type ${model.name} = ${enumTypes};`;
    }
    renderItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const enums = this.model.values || [];
            const items = [];
            for (const item of enums) {
                const renderedItem = yield this.runItemPreset(item);
                items.push(renderedItem);
            }
            return this.renderBlock(items);
        });
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
}
exports.EnumRenderer = EnumRenderer;
exports.TS_DEFAULT_ENUM_PRESET = {
    self({ renderer, options, model }) {
        if (options.enumType === 'union' && model instanceof models_1.ConstrainedEnumModel) {
            return renderer.renderUnionEnum(model);
        }
        return renderer.defaultSelf();
    },
    item({ item }) {
        return `${item.key} = ${item.value},`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map