"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const helpers_1 = require("../../helpers");
/**
 * Common renderer for TypeScript types
 *
 * @extends AbstractRenderer
 */
class TypeScriptRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = helpers_1.FormatHelpers.breakLines(lines);
        const renderedLines = lines.map((line) => ` * ${line}`).join('\n');
        return `/**
${renderedLines}
 */`;
    }
}
exports.TypeScriptRenderer = TypeScriptRenderer;
//# sourceMappingURL=TypeScriptRenderer.js.map