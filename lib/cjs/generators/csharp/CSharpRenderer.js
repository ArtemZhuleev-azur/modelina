"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const FormatHelpers_1 = require("../../helpers/FormatHelpers");
/**
 * Common renderer for CSharp types
 *
 * @extends AbstractRenderer
 */
class CSharpRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = FormatHelpers_1.FormatHelpers.breakLines(lines);
        return lines.map((line) => `// ${line}`).join('\n');
    }
}
exports.CSharpRenderer = CSharpRenderer;
//# sourceMappingURL=CSharpRenderer.js.map