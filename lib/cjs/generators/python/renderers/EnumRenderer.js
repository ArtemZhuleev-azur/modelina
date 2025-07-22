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
exports.PYTHON_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const PythonRenderer_1 = require("../PythonRenderer");
/**
 * Renderer for Python's `enum` type
 *
 * @extends PythonRenderer
 */
class EnumRenderer extends PythonRenderer_1.PythonRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
                yield this.runAdditionalContentPreset()
            ];
            return `class ${this.model.name}(Enum): 
${this.indent(this.renderBlock(content, 2), 2)}`;
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
}
exports.EnumRenderer = EnumRenderer;
exports.PYTHON_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        renderer.dependencyManager.addDependency('from enum import Enum');
        return renderer.defaultSelf();
    },
    item({ item }) {
        return `${item.key} = ${item.value}`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map