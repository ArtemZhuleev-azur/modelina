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
exports.JAVA_DEFAULT_RECORD_PRESET = exports.RecordRenderer = void 0;
const JavaRenderer_1 = require("../JavaRenderer");
const models_1 = require("../../../models");
const JavaConstrainer_1 = require("../JavaConstrainer");
/**
 * Renderer for Java's `record` type
 *
 * @extends JavaRenderer
 */
class RecordRenderer extends JavaRenderer_1.JavaRenderer {
    defaultSelf() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.runCtorPreset(),
                yield this.runAdditionalContentPreset()
            ];
            if (this.model.containsPropertyType(models_1.ConstrainedArrayModel) &&
                ((_a = this.options) === null || _a === void 0 ? void 0 : _a.collectionType) === 'List') {
                this.dependencyManager.addDependency('import java.util.List;');
            }
            if (this.model.containsPropertyType(models_1.ConstrainedDictionaryModel)) {
                this.dependencyManager.addDependency('import java.util.Map;');
            }
            const parentUnions = this.getParentUnions();
            const parents = [...(parentUnions !== null && parentUnions !== void 0 ? parentUnions : [])];
            const recordProperties = yield this.renderProperties();
            if (parents.length) {
                for (const i of parents) {
                    this.dependencyManager.addModelDependency(i);
                }
                const inheritanceKeyworkd = 'implements';
                return `public record ${this.model.name}(${recordProperties}) ${inheritanceKeyworkd} ${parents.map((i) => i.name).join(', ')} {
${this.indent(this.renderBlock(content, 2))}
}`;
            }
            return `public record ${this.model.name}(${recordProperties}) {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
    /**
     * Render all the properties for the class.
     */
    renderProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                const rendererProperty = yield this.runPropertyPreset(property);
                content.push(rendererProperty);
            }
            return content.join(', ');
        });
    }
    runPropertyPreset(property) {
        return this.runPreset('property', { property });
    }
    getParentUnions() {
        const parentUnions = [];
        if (!this.model.options.parents) {
            return undefined;
        }
        for (const model of this.model.options.parents) {
            if (model instanceof models_1.ConstrainedUnionModel &&
                !(0, JavaConstrainer_1.unionIncludesBuiltInTypes)(model)) {
                parentUnions.push(model);
            }
        }
        if (!parentUnions.length) {
            return undefined;
        }
        return parentUnions;
    }
}
exports.RecordRenderer = RecordRenderer;
exports.JAVA_DEFAULT_RECORD_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property }) {
        return `${property.property.type} ${property.propertyName}`;
    }
};
//# sourceMappingURL=RecordRenderer.js.map