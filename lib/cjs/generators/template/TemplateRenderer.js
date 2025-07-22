"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
/**
 * Common renderer for Template
 *
 * @extends AbstractRenderer
 */
class TemplateRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
}
exports.TemplateRenderer = TemplateRenderer;
//# sourceMappingURL=TemplateRenderer.js.map