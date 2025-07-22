"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUST_COMMON_PRESET = exports.defaultRustCommonPresetOptions = void 0;
const models_1 = require("../../../models");
const utils_1 = require("../../../utils");
exports.defaultRustCommonPresetOptions = {
    implementDefault: true,
    deriveDefault: true,
    implementNew: true
};
/**
 * Get default first member of enum
 */
function getEnumDefaultOrFirst(model) {
    const maybeDefault = model.values.find((v, idx) => {
        const originalValue = model.originalInput.enum[Number(idx)];
        if (model.originalInput.default &&
            model.originalInput.default === originalValue) {
            return v;
        }
    });
    if (maybeDefault === undefined) {
        utils_1.Logger.warn(`Schema does not provide default value for field ${model.originalInput} - this is incompatible with RustGenerator's #[derive Default] implementation. Please re-run with { deriveDefault: false } option`);
        return model.values[0];
    }
    return maybeDefault;
}
/**
 * Render `impl Default` for enum model
 */
function renderImplementDefault({ model }) {
    const defaultConstrainedValue = getEnumDefaultOrFirst(model);
    const defaultValue = defaultConstrainedValue.key;
    return `impl Default for ${model.name} {
    fn default() -> ${model.name} {
        ${model.name}::${defaultValue}
    }
}`;
}
/**
 * Render `new` constructor function in struct impl
 */
function renderImplementNew({ model, renderer }) {
    const args = [];
    const fields = [];
    const properties = model.properties || {};
    for (const v of Object.values(properties)) {
        const prefix = v.property instanceof models_1.ConstrainedReferenceModel ? 'crate::' : '';
        const fieldType = prefix + v.property.type;
        if (v.required) {
            args.push(`${v.propertyName}: ${fieldType}`);
            if (v.property instanceof models_1.ConstrainedReferenceModel) {
                fields.push(`${v.propertyName}: Box::new(${v.propertyName}),`);
            }
            else {
                fields.push(`${v.propertyName},`);
            }
            // use map to box reference if field is optional
        }
        else if (!v.required &&
            (v.property instanceof models_1.ConstrainedReferenceModel ||
                v.property instanceof models_1.ConstrainedUnionModel)) {
            args.push(`${v.propertyName}: Option<crate::${v.property.type}>`);
            fields.push(`${v.propertyName}: ${v.propertyName}.map(Box::new),`);
        }
        else {
            args.push(`${v.propertyName}: Option<${fieldType}>`);
            fields.push(`${v.propertyName},`);
        }
    }
    const fieldsBlock = renderer.renderBlock(fields);
    return `pub fn new(${args.join(', ')}) -> ${model.name} {
    ${model.name} {
${renderer.indent(fieldsBlock, 8)}
    }
}`;
}
exports.RUST_COMMON_PRESET = {
    enum: {
        additionalContent({ renderer, model, content, options }) {
            options = options || exports.defaultRustCommonPresetOptions;
            const blocks = [];
            if (options.implementDefault) {
                blocks.push(renderImplementDefault({ renderer, model }));
            }
            return renderer.renderBlock([content, ...blocks], 2);
        }
    },
    struct: {
        additionalContent({ renderer, model, content, options }) {
            options = options || exports.defaultRustCommonPresetOptions;
            const fnBlocks = [];
            if (options.implementNew) {
                fnBlocks.push(renderImplementNew({ model, renderer }));
            }
            const fnBlock = renderer.renderBlock(fnBlocks);
            const contentBlock = `
impl ${model.name} {
${renderer.indent(fnBlock, 4)}
}
`;
            content = renderer.renderBlock([content, contentBlock]);
            return content;
        }
    },
    tuple: {
        additionalContent({ renderer, model, content, options }) {
            options = options || exports.defaultRustCommonPresetOptions;
            if (options.implementNew) {
                const properties = model.tuple;
                const args = Object.values(properties).map((v, idx) => `value_${idx}: ${v.value.type}`);
                const fields = Object.values(properties).map((_v, idx) => `value_${idx}`);
                const implementNew = `
impl ${model.name} {
    pub fn new(${args.join(', ')}) -> ${model.name} {
        ${model.name}(${fields.join(', ')})
    }
}
`;
                content = renderer.renderBlock([content, implementNew]);
            }
            return content;
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map