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
exports.CSHARP_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const CSharpRenderer_1 = require("../CSharpRenderer");
/**
 * Renderer for C#'s `enum` type
 *
 * @extends CSharpRenderer
 */
class EnumRenderer extends CSharpRenderer_1.CSharpRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const enumItems = yield this.renderItems();
            const getValueCaseItemValues = this.getValueCaseItemValues();
            const toEnumCaseItemValues = this.toEnumCaseItemValues();
            const enumValueSwitch = `switch (enumValue)
{
${this.indent(getValueCaseItemValues)}
}
return null;`;
            const valueSwitch = `switch (value)
{
${this.indent(toEnumCaseItemValues)}
}
return null;`;
            const classContent = `public static ${this.model.type}? GetValue(this ${this.model.name} enumValue)
{
${this.indent(enumValueSwitch)}
}

public static ${this.model.name}? To${this.model.name}(dynamic? value)
{
${this.indent(valueSwitch)}
}`;
            return `public enum ${this.model.name}
{
${this.indent(enumItems)}
}

public static class ${this.model.name}Extensions
{
${this.indent(classContent)}
}
`;
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
            const content = items.join(',\n');
            return `${content}`;
        });
    }
    toEnumCaseItemValues() {
        const enums = this.model.values || [];
        const items = [];
        for (const enumValue of enums) {
            items.push(`case ${enumValue.value}: return ${this.model.name}.${enumValue.key};`);
        }
        const content = items.join('\n');
        return `${content}`;
    }
    getValueCaseItemValues() {
        const enums = this.model.values || [];
        const items = [];
        for (const enumValue of enums) {
            items.push(`case ${this.model.name}.${enumValue.key}: return ${enumValue.value};`);
        }
        const content = items.join('\n');
        return `${content}`;
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
}
exports.EnumRenderer = EnumRenderer;
exports.CSHARP_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ item }) {
        return `[EnumMember(Value = ${item.value})]\n${item.key}`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map