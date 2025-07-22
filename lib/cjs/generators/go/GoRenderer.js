"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const FormatHelpers_1 = require("../../helpers/FormatHelpers");
/**
 * Common renderer for Go types
 *
 * @extends AbstractRenderer
 */
class GoRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = FormatHelpers_1.FormatHelpers.breakLines(lines);
        return lines.map((line) => `// ${line}`).join('\n');
    }
}
exports.GoRenderer = GoRenderer;
//# sourceMappingURL=GoRenderer.js.map