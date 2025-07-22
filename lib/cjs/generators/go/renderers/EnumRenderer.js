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
exports.GO_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const GoRenderer_1 = require("../GoRenderer");
/**
 * Renderer for Go's `enum` type
 *
 * This renderer is a generic solution that works for all types of enum values.
 * This is also why you wont see `type MyEnum string´ even if possible.
 *
 * @extends GoRenderer
 */
class EnumRenderer extends GoRenderer_1.GoRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const enumValues = yield this.renderItems();
            const valuesToEnumMap = this.model.values.map((value) => {
                return `${this.model.name}Values[${value.key}]: ${value.key},`;
            });
            const additionalContent = yield this.runAdditionalContentPreset();
            const values = this.model.values
                .map((value) => {
                return value.value;
            })
                .join(',');
            return `type ${this.model.name} uint

const (
${this.indent(enumValues)}
)

// Value returns the value of the enum.
func (op ${this.model.name}) Value() any {
	if op >= ${this.model.name}(len(${this.model.name}Values)) {
		return nil
	}
	return ${this.model.name}Values[op]
}

var ${this.model.name}Values = []any{${values}}
var ValuesTo${this.model.name} = map[any]${this.model.name}{
${this.indent(this.renderBlock(valuesToEnumMap))}
}
${additionalContent}`;
        });
    }
    renderItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const enums = this.model.values || [];
            const items = [];
            for (const [index, item] of enums.entries()) {
                const renderedItem = yield this.runItemPreset(item, index);
                items.push(renderedItem);
            }
            return this.renderBlock(items);
        });
    }
    runItemPreset(item, index) {
        return this.runPreset('item', { item, index });
    }
}
exports.EnumRenderer = EnumRenderer;
exports.GO_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ model, item, index }) {
        if (index === 0) {
            return `${item.key} ${model.name} = iota`;
        }
        if (typeof item.value === 'string') {
            return item.key;
        }
        return item.key;
    }
};
//# sourceMappingURL=EnumRenderer.js.map