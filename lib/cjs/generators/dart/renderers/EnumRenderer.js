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
exports.DART_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const DartRenderer_1 = require("../DartRenderer");
/**
 * Renderer for Dart's `enum` type
 *
 * @extends DartRenderer
 */
class EnumRenderer extends DartRenderer_1.DartRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [yield this.renderItems()];
            return `enum ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    renderItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [];
            for (const value of this.model.values) {
                const renderedItem = yield this.runItemPreset(value);
                items.push(renderedItem);
            }
            const content = items.join(', ');
            return `${content}`;
        });
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
}
exports.EnumRenderer = EnumRenderer;
exports.DART_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ item }) {
        return `${item.value}`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map