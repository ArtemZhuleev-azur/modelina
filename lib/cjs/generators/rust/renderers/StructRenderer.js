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
exports.RUST_DEFAULT_STRUCT_PRESET = exports.StructRenderer = void 0;
const RustRenderer_1 = require("../RustRenderer");
const models_1 = require("../../../models");
/**
 * Renderer for Rust `struct` type
 *
 * @extends RustRenderer
 */
class StructRenderer extends RustRenderer_1.RustRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [yield this.renderFields()];
            const structMacro = yield this.runStructMacroPreset();
            const doc = this.renderComments(`${this.model.name} represents a ${this.model.name} model.`);
            const additionalContent = yield this.runAdditionalContentPreset();
            return `${doc}
${structMacro}
pub struct ${this.model.name} {
${this.indent(this.renderBlock(content))}
}
${additionalContent}`;
        });
    }
    renderFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this.model.properties;
            const content = [];
            for (const field of Object.values(fields)) {
                const renderFieldMacro = yield this.runFieldMacroPreset(field);
                content.push(renderFieldMacro);
                const renderField = yield this.runFieldPreset(field);
                content.push(renderField);
            }
            return this.renderBlock(content);
        });
    }
    runStructMacroPreset() {
        return this.runPreset('structMacro');
    }
    runFieldMacroPreset(field) {
        return this.runPreset('fieldMacro', { field });
    }
    runFieldPreset(field) {
        return this.runPreset('field', { field });
    }
}
exports.StructRenderer = StructRenderer;
exports.RUST_DEFAULT_STRUCT_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    structMacro({ model, renderer }) {
        return renderer.renderMacro(model);
    },
    fieldMacro({ field }) {
        const serdeArgs = [];
        serdeArgs.push(`rename="${field.unconstrainedPropertyName}"`);
        if (!field.required) {
            serdeArgs.push('skip_serializing_if = "Option::is_none"');
        }
        return `#[serde(${serdeArgs.join(', ')})]`;
    },
    field({ field }) {
        let fieldType = field.property.type;
        if (field.property instanceof models_1.ConstrainedReferenceModel) {
            fieldType = `Box<crate::${fieldType}>`;
        }
        if (!field.required) {
            fieldType = `Option<${fieldType}>`;
        }
        return `pub ${field.propertyName}: ${fieldType},`;
    }
};
//# sourceMappingURL=StructRenderer.js.map