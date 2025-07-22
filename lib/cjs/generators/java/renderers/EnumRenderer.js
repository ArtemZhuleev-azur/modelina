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
exports.JAVA_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const JavaRenderer_1 = require("../JavaRenderer");
/**
 * Renderer for Java's `enum` type
 *
 * @extends JavaRenderer
 */
class EnumRenderer extends JavaRenderer_1.JavaRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
                yield this.runCtorPreset(),
                yield this.runGetValuePreset(),
                yield this.runFromValuePreset(),
                yield this.runAdditionalContentPreset()
            ];
            return `public enum ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
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
            const content = items.join(', ');
            return `${content};`;
        });
    }
    runItemPreset(item) {
        return this.runPreset('item', { item });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
    runGetValuePreset() {
        return this.runPreset('getValue');
    }
    runFromValuePreset() {
        return this.runPreset('fromValue');
    }
}
exports.EnumRenderer = EnumRenderer;
exports.JAVA_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    item({ item, model }) {
        //Cast the enum type just to be sure, as some cases can be `int` type with floating value.
        return `${item.key}((${model.type})${item.value})`;
    },
    ctor({ model }) {
        return `private final ${model.type} value;

${model.name}(${model.type} value) {
  this.value = value;
}`;
    },
    getValue({ model }) {
        return `public ${model.type} getValue() {
  return value;
}`;
    },
    fromValue({ model }) {
        const valueComparitor = model.type.charAt(0) === model.type.charAt(0).toUpperCase()
            ? 'e.value.equals(value)'
            : 'e.value == value';
        return `public static ${model.name} fromValue(${model.type} value) {
  for (${model.name} e : ${model.name}.values()) {
    if (${valueComparitor}) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
    },
    additionalContent() {
        return `@Override
public String toString() {
  return String.valueOf(value);
}`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map