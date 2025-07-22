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
exports.PHP_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const PhpRenderer_1 = require("../PhpRenderer");
/**
 * Renderer for PHP's `enum` type
 *
 * @extends PhpRenderer
 */
class EnumRenderer extends PhpRenderer_1.PhpRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
                yield this.runAdditionalContentPreset()
            ];
            return `enum ${this.model.name}
{
${this.indent(this.renderBlock(content, 2))}
}
`;
        });
    }
    renderItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const enums = this.model.values || [];
            const items = [];
            for (const value of enums) {
                const renderedItem = yield this.runItemPreset(value);
                items.push(renderedItem);
            }
            return items.join('\n');
        });
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
}
exports.EnumRenderer = EnumRenderer;
exports.PHP_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ item }) {
        return `case ${item.key};`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map