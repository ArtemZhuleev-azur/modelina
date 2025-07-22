"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const helpers_1 = require("../../helpers");
/**
 * Common renderer for Python
 *
 * @extends AbstractRenderer
 */
class PythonRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = helpers_1.FormatHelpers.breakLines(lines);
        const content = lines.join('\n');
        return `"""
${content}
"""`;
    }
}
exports.PythonRenderer = PythonRenderer;
//# sourceMappingURL=PythonRenderer.js.map