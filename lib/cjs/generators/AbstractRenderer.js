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
exports.AbstractRenderer = void 0;
const helpers_1 = require("../helpers");
/**
 * Abstract renderer with common helper methods
 */
class AbstractRenderer {
    constructor(options, generator, presets, model, inputModel) {
        this.options = options;
        this.generator = generator;
        this.presets = presets;
        this.model = model;
        this.inputModel = inputModel;
    }
    renderLine(line) {
        return `${line}\n`;
    }
    renderBlock(lines, newLines = 1) {
        const n = Array(newLines).fill('\n').join('');
        return lines.filter(Boolean).join(n);
    }
    indent(content, size, type) {
        var _a, _b;
        size = size || ((_a = this.options.indentation) === null || _a === void 0 ? void 0 : _a.size);
        type = type || ((_b = this.options.indentation) === null || _b === void 0 ? void 0 : _b.type);
        return helpers_1.FormatHelpers.indent(content, size, type);
    }
    runSelfPreset() {
        return this.runPreset('self');
    }
    runAdditionalContentPreset() {
        return this.runPreset('additionalContent');
    }
    runPreset(functionName, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let content = '';
            for (const [preset, options] of this.presets) {
                if (typeof preset[String(functionName)] === 'function') {
                    const presetRenderedContent = yield preset[String(functionName)](Object.assign(Object.assign({}, params), { renderer: this, content,
                        options, model: this.model, inputModel: this.inputModel }));
                    if (typeof presetRenderedContent === 'string') {
                        content = presetRenderedContent;
                    }
                    else {
                        content = '';
                    }
                }
            }
            return content;
        });
    }
}
exports.AbstractRenderer = AbstractRenderer;
//# sourceMappingURL=AbstractRenderer.js.map