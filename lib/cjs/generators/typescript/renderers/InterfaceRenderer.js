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
exports.TS_DEFAULT_INTERFACE_PRESET = exports.InterfaceRenderer = void 0;
const TypeScriptObjectRenderer_1 = require("../TypeScriptObjectRenderer");
/**
 * Renderer for TypeScript's `interface` type
 *
 * @extends TypeScriptRenderer
 */
class InterfaceRenderer extends TypeScriptObjectRenderer_1.TypeScriptObjectRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runAdditionalContentPreset()
            ];
            return `interface ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
}
exports.InterfaceRenderer = InterfaceRenderer;
exports.TS_DEFAULT_INTERFACE_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ renderer, property }) {
        return renderer.renderProperty(property);
    }
};
//# sourceMappingURL=InterfaceRenderer.js.map