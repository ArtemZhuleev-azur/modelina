"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhpRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const helpers_1 = require("../../helpers");
/**
 * Common renderer for PHP
 *
 * @extends AbstractRenderer
 */
class PhpRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = helpers_1.FormatHelpers.breakLines(lines);
        return lines.map((line) => `* ${line}`).join('\n');
    }
}
exports.PhpRenderer = PhpRenderer;
//# sourceMappingURL=PhpRenderer.js.map