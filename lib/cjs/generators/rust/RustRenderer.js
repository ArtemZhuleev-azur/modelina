"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const FormatHelpers_1 = require("../../helpers/FormatHelpers");
const RustConstrainer_1 = require("./RustConstrainer");
/**
 * Common renderer for Rust types
 *
 * @extends AbstractRenderer
 */
class RustRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = FormatHelpers_1.FormatHelpers.breakLines(lines);
        return lines.map((line) => `// ${line}`).join('\n');
    }
    renderMacro(model) {
        const derive = ['Serialize', 'Deserialize', 'Clone', 'Debug'];
        if ((0, RustConstrainer_1.deriveHash)(model)) {
            derive.push('Hash');
        }
        if ((0, RustConstrainer_1.deriveCopy)(model)) {
            derive.push('Copy');
        }
        if ((0, RustConstrainer_1.derivePartialEq)(model)) {
            derive.push('PartialEq');
        }
        if ((0, RustConstrainer_1.deriveEq)(model)) {
            derive.push('Eq');
        }
        if ((0, RustConstrainer_1.derivePartialOrd)(model)) {
            derive.push('PartialOrd');
        }
        if ((0, RustConstrainer_1.deriveOrd)(model)) {
            derive.push('Ord');
        }
        derive.sort();
        return `#[derive(${derive.join(', ')})]`;
    }
}
exports.RustRenderer = RustRenderer;
//# sourceMappingURL=RustRenderer.js.map