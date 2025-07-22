"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CplusplusRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
/**
 * Common renderer for Cplusplus
 *
 * @extends AbstractRenderer
 */
class CplusplusRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
}
exports.CplusplusRenderer = CplusplusRenderer;
//# sourceMappingURL=CplusplusRenderer.js.map