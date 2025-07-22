"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutputModel = void 0;
/**
 * Common representation for the output model.
 */
class OutputModel {
    constructor(result, model, modelName, inputModel, dependencies) {
        this.result = result;
        this.model = model;
        this.modelName = modelName;
        this.inputModel = inputModel;
        this.dependencies = dependencies;
    }
    static toOutputModel(args) {
        if (Array.isArray(args)) {
            return args.map((arg) => new this(arg.result, arg.model, arg.modelName, arg.inputModel, arg.dependencies));
        }
        return new this(args.result, args.model, args.modelName, args.inputModel, args.dependencies);
    }
}
exports.OutputModel = OutputModel;
//# sourceMappingURL=OutputModel.js.map