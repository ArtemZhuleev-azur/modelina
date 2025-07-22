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
exports.RUST_DEFAULT_TUPLE_PRESET = exports.TupleRenderer = void 0;
const RustRenderer_1 = require("../RustRenderer");
/**
 * Renderer for Rust's `Tuple` type
 *
 * @extends TupleRenderer
 */
class TupleRenderer extends RustRenderer_1.RustRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.renderComments(`${this.model.name} represents a ${this.model.name} model.`);
            const structMacro = yield this.runStructMacroPreset();
            const additionalContent = yield this.runAdditionalContentPreset();
            const fields = yield this.renderFields();
            return `${doc}
${structMacro}
pub struct ${this.model.name}(${fields});
${additionalContent}
`;
        });
    }
    renderFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this.model.tuple;
            const content = [];
            for (const field of Object.values(fields)) {
                const renderField = yield this.runFieldPreset(field);
                content.push(renderField);
            }
            return content.join(', ');
        });
    }
    runStructMacroPreset() {
        return this.runPreset('structMacro');
    }
    runFieldPreset(field) {
        return this.runPreset('field', { field });
    }
}
exports.TupleRenderer = TupleRenderer;
exports.RUST_DEFAULT_TUPLE_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    structMacro({ model, renderer }) {
        return renderer.renderMacro(model);
    },
    field({ field }) {
        return field.value.type;
    }
};
//# sourceMappingURL=TupleRenderer.js.map