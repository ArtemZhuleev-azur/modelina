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
exports.TEMPLATE_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const TemplateRenderer_1 = require("../TemplateRenderer");
/**
 * Renderer for Template's `enum` type
 *
 * @extends TemplateRenderer
 */
class EnumRenderer extends TemplateRenderer_1.TemplateRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderItems(),
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
}
exports.EnumRenderer = EnumRenderer;
exports.TEMPLATE_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        renderer.dependencyManager.addDependency('import com.fasterxml.jackson.annotation.*;');
        return renderer.defaultSelf();
    },
    item({ item }) {
        return `${item.key}(${item.value})`;
    },
    additionalContent({ model }) {
        const enumValueType = 'Object';
        return `private ${enumValueType} value;

${model.type}(${enumValueType} value) {
  this.value = value;
}

@JsonValue
public ${enumValueType} getValue() {
  return value;
}

@Override
public String toString() {
  return String.valueOf(value);
}

@JsonCreator
public static ${model.type} fromValue(${enumValueType} value) {
  for (${model.type} e : ${model.type}.values()) {
    if (e.value.equals(value)) {
      return e;
    }
  }
  throw new IllegalArgumentException("Unexpected value '" + value + "'");
}`;
    }
};
//# sourceMappingURL=EnumRenderer.js.map