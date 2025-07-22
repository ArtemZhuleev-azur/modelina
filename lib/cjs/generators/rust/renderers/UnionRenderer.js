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
exports.RUST_DEFAULT_UNION_PRESET = exports.UnionRenderer = void 0;
const RustRenderer_1 = require("../RustRenderer");
const models_1 = require("../../../models");
const index_1 = require("../../../index");
/**
 * Renderer for Rust's `Union` type
 *
 * @extends UnionRenderer
 */
class UnionRenderer extends RustRenderer_1.RustRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = this.renderComments(`${this.model.name} represents a union of types: ${this.model.union
                .map((m) => m.type)
                .join(', ')}`);
            const structMacro = yield this.runStructMacroPreset();
            const variants = yield Promise.all(this.model.union.map((v) => __awaiter(this, void 0, void 0, function* () {
                const macro = yield this.runItemMacroPreset(v);
                const variant = `${yield this.runItemPreset(v)},`;
                return [macro, variant];
            })));
            const additionalContent = yield this.runAdditionalContentPreset();
            return `${doc}
${structMacro}
pub enum ${this.model.name} {
${this.indent(this.renderBlock(variants.flat()))}
}
${additionalContent}
`;
        });
    }
    runStructMacroPreset() {
        return this.runPreset('structMacro');
    }
    runItemMacroPreset(item) {
        return this.runPreset('itemMacro', { item });
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
}
exports.UnionRenderer = UnionRenderer;
exports.RUST_DEFAULT_UNION_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    structMacro({ model, renderer }) {
        const blocks = [renderer.renderMacro(model)];
        if (model.options.discriminator) {
            // when discriminator is provided, polymorphic type is internally-tagged:
            // https://serde.rs/enum-representations.html#internally-tagged
            const discriminatorBlock = `#[serde(tag = "${model.options.discriminator.discriminator}")]`;
            blocks.push(discriminatorBlock);
        }
        else {
            // otherwise if a discriminator field is not provided, use untagged representation
            // https://serde.rs/enum-representations.html#untagged
            // a warning is logged because this is a highly inefficient deserialization method
            index_1.Logger.warn(`${model.name} is a polymorphic schema, but no discriminator field was found. RustGenerator will use serde's untagged data representation, which attempts to match against the first valid data representation. This is significantly slower than deserializing a tagged data representation. You should provide a discriminator field if possible. See serde tagged/untagged docs for more info: https://serde.rs/enum-representations.html#untagged`);
            const discriminatorBlock = '#[serde(untagged)]';
            blocks.push(discriminatorBlock);
        }
        return renderer.renderBlock(blocks);
    },
    itemMacro({ item }) {
        const serdeArgs = [];
        serdeArgs.push(`rename="${item.name}"`);
        return `#[serde(${serdeArgs.join(', ')})]`;
    },
    item({ item }) {
        if (item instanceof models_1.ConstrainedReferenceModel) {
            return `${item.name}(crate::${item.ref.type})`;
        }
        return `${item.name}(${item.type})`;
    }
};
//# sourceMappingURL=UnionRenderer.js.map