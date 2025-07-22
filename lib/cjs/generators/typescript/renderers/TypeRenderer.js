"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS_DEFAULT_TYPE_PRESET = exports.TypeRenderer = void 0;
const TypeScriptRenderer_1 = require("../TypeScriptRenderer");
/**
 * Renderer for TypeScript's `type` type
 *
 * @extends TypeScriptRenderer
 */
class TypeRenderer extends TypeScriptRenderer_1.TypeScriptRenderer {
    defaultSelf() {
        return `type ${this.model.name} = ${this.model.type};`;
    }
}
exports.TypeRenderer = TypeRenderer;
exports.TS_DEFAULT_TYPE_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    }
};
//# sourceMappingURL=TypeRenderer.js.map