"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderOutput = void 0;
/**
 * Common representation for the rendered output.
 */
class RenderOutput {
    constructor(result, renderedName, dependencies = []) {
        this.result = result;
        this.renderedName = renderedName;
        this.dependencies = dependencies;
    }
    static toRenderOutput(args) {
        return new this(args.result, args.renderedName, args.dependencies);
    }
}
exports.RenderOutput = RenderOutput;
//# sourceMappingURL=RenderOutput.js.map