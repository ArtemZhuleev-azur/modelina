"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSHARP_COMMON_PRESET = void 0;
const helpers_1 = require("../../../helpers");
/**
 * Render `equal` function based on model's properties
 */
function renderEqual({ renderer, model }) {
    const properties = model.properties || {};
    const propertyKeys = Object.keys(properties);
    let equalProperties = propertyKeys
        .map((propertyName) => {
        const accessorMethodProp = helpers_1.FormatHelpers.upperFirst(propertyName);
        return `Object.Equals(${accessorMethodProp}, model.${accessorMethodProp})`;
    })
        .join(' && \n');
    equalProperties = `return ${equalProperties !== '' ? equalProperties : 'true'}`;
    const methodContent = `if(obj is ${model.name} model)
{
${renderer.indent('if(ReferenceEquals(this, model)) { return true; }')}
${renderer.indent(equalProperties)};
}

return false;`;
    return `public override bool Equals(object obj)
{
${renderer.indent(methodContent)}
}`;
}
/**
 * Render `hashCode` function based on model's properties
 */
function renderHashCode({ renderer, model }) {
    const properties = model.properties || {};
    const propertyKeys = Object.keys(properties);
    const hashProperties = propertyKeys
        .map((propertyName) => `hash.Add(${helpers_1.FormatHelpers.upperFirst(propertyName)});`)
        .join('\n');
    return `public override int GetHashCode()
{
  HashCode hash = new HashCode();
${renderer.indent(hashProperties, 2)}
  return hash.ToHashCode();
}`;
}
/**
 * Preset which adds `Equals`, `GetHashCode` functions to class.
 *
 * @implements {CSharpPreset}
 */
exports.CSHARP_COMMON_PRESET = {
    class: {
        additionalContent({ renderer, model, content, options }) {
            options = options || {};
            const blocks = [];
            if (options.equal === undefined || options.equal === true) {
                blocks.push(renderEqual({ renderer, model }));
            }
            if (options.hash === undefined || options.hash === true) {
                renderer.dependencyManager.addDependency('using System;');
                blocks.push(renderHashCode({ renderer, model }));
            }
            return renderer.renderBlock([content, ...blocks], 2);
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map