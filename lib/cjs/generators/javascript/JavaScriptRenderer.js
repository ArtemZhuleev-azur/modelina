"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const helpers_1 = require("../../helpers");
/**
 * Common renderer for JavaScript types
 *
 * @extends AbstractRenderer
 */
class JavaScriptRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = helpers_1.FormatHelpers.breakLines(lines);
        const content = lines.map((line) => ` * ${line}`).join('\n');
        return `/**
${content}
 */`;
    }
}
exports.JavaScriptRenderer = JavaScriptRenderer;
//# sourceMappingURL=JavaScriptRenderer.js.map