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
exports.RUST_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const RustRenderer_1 = require("../RustRenderer");
/**
 * Renderer for Rust's `enum` type
 *
 * @extends EnumRenderer
 */
class EnumRenderer extends RustRenderer_1.RustRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.renderComments(`${this.model.name} represents a ${this.model.name} model.`);
            const structMacro = yield this.runStructMacroPreset();
            const items = yield this.renderItems();
            const additionalContent = yield this.runAdditionalContentPreset();
            return `${doc}
${structMacro}
pub enum ${this.model.name} {
${this.indent(items)}
}
${additionalContent}`;
        });
    }
    renderItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const enums = this.model.values || [];
            const items = yield Promise.all(enums.map((value, index) => __awaiter(this, void 0, void 0, function* () {
                const macro = yield this.runItemMacroPreset(value, index);
                const renderedItem = `${yield this.runItemPreset(value, index)},`;
                return [macro, renderedItem];
            })));
            return this.renderBlock(items.flat());
        });
    }
    runItemPreset(item, itemIndex) {
        return this.runPreset('item', { item, itemIndex });
    }
    runItemMacroPreset(item, itemIndex) {
        return this.runPreset('itemMacro', { item, itemIndex });
    }
    runStructMacroPreset() {
        return this.runPreset('structMacro');
    }
    /**
     * Returns the type for the JSON value
     */
    renderEnumValueType(value) {
        switch (typeof value) {
            case 'boolean':
                return 'bool';
            case 'bigint':
                return 'i64';
            case 'number': {
                return 'f64';
            }
            case 'object': {
                return 'HashMap<String, serde_json::Value>';
            }
            case 'string':
            default: {
                return 'String';
            }
        }
    }
}
exports.EnumRenderer = EnumRenderer;
exports.RUST_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ item, renderer }) {
        const typeOfEnumValue = renderer.renderEnumValueType(item.value);
        if (typeOfEnumValue === 'HashMap<String, serde_json::Value>') {
            return `${item.key}(${typeOfEnumValue})`;
        }
        return `${item.key}`;
    },
    itemMacro({ item }) {
        const serdeArgs = [];
        if (typeof item.value === 'object') {
            serdeArgs.push('flatten');
        }
        else {
            serdeArgs.push(`rename="${item.value}"`);
        }
        return `#[serde(${serdeArgs.join(', ')})]`;
    },
    structMacro({ model, renderer }) {
        return renderer.renderMacro(model);
    }
};
//# sourceMappingURL=EnumRenderer.js.map