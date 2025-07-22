"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalaRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const helpers_1 = require("../../helpers");
/**
 * Common renderer for Scala
 *
 * @extends AbstractRenderer
 */
class ScalaRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = helpers_1.FormatHelpers.breakLines(lines);
        const newLiteral = lines.map((line) => ` * ${line}`).join('\n');
        return `/**
${newLiteral}
 */`;
    }
    renderAnnotation(annotationName, value) {
        const name = `@${annotationName}`;
        if (value === undefined || value === null) {
            return name;
        }
        if (typeof value !== 'object') {
            return `${name}(${value})`;
        }
        const entries = Object.entries(value || {});
        if (entries.length === 0) {
            return name;
        }
        const values = concatenateEntries(entries);
        return `${name}(${values})`;
    }
}
exports.ScalaRenderer = ScalaRenderer;
function concatenateEntries(entries = []) {
    return entries
        .map(([paramName, newValue]) => {
        if (paramName && newValue !== undefined) {
            return `${paramName}=${newValue}`;
        }
        return newValue;
    })
        .filter((v) => v !== undefined)
        .join(', ');
}
//# sourceMappingURL=ScalaRenderer.js.map