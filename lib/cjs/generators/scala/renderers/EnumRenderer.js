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
exports.SCALA_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const ScalaRenderer_1 = require("../ScalaRenderer");
const helpers_1 = require("../../../helpers");
/**
 * Renderer for Scala's `enum` type
 *
 * @extends ScalaRenderer
 */
class EnumRenderer extends ScalaRenderer_1.ScalaRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
                yield this.runFromValuePreset(),
                yield this.runAdditionalContentPreset()
            ];
            return `object ${this.model.name} extends Enumeration {
  type ${this.model.name} = Value

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
            const content = items.join('\n');
            return `${content}`;
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
exports.SCALA_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ item, model }) {
        const key = helpers_1.FormatHelpers.toPascalCase(item.key);
        return `val ${key}: ${model.name}.Value = Value(${item.value})`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map