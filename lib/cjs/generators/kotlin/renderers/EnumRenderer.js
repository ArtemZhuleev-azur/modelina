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
exports.KOTLIN_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const KotlinRenderer_1 = require("../KotlinRenderer");
/**
 * Renderer for Kotlin's `enum` type
 *
 * @extends KotlinRenderer
 */
class EnumRenderer extends KotlinRenderer_1.KotlinRenderer {
    defaultSelf(valueType) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
                yield this.runFromValuePreset(),
                yield this.runAdditionalContentPreset()
            ];
            return `enum class ${this.model.name}(val value: ${valueType}) {
${this.indent(this.renderBlock(content, 2))}
}`;
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
            const content = items.join(', \n');
            return `${content};`;
        });
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
    runFromValuePreset() {
        return this.runPreset('fromValue');
    }
}
exports.EnumRenderer = EnumRenderer;
exports.KOTLIN_DEFAULT_ENUM_PRESET = {
    self({ renderer, model }) {
        return renderer.defaultSelf(model.type);
    },
    item({ item }) {
        return `${item.key}(${item.value})`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map