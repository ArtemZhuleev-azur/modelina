"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaDependencyManager = void 0;
const models_1 = require("../../models");
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
const JavaConstrainer_1 = require("./JavaConstrainer");
class JavaDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
        this.modelDependencies = [];
    }
    renderImport(model, packageName) {
        return `import ${packageName}.${model.name};`;
    }
    renderAllModelDependencies(model, packageName) {
        return [...this.modelDependencies, ...model.getNearestDependencies()]
            .filter((dependencyModel) => {
            if (dependencyModel instanceof models_1.ConstrainedUnionModel) {
                return !(0, JavaConstrainer_1.unionIncludesBuiltInTypes)(dependencyModel);
            }
            else if (dependencyModel instanceof models_1.ConstrainedReferenceModel &&
                dependencyModel.ref instanceof models_1.ConstrainedUnionModel) {
                return !(0, JavaConstrainer_1.unionIncludesBuiltInTypes)(dependencyModel.ref);
            }
            return true;
        })
            .map((dependencyModel) => {
            return this.renderImport(dependencyModel, packageName);
        })
            .join('\n');
    }
    addModelDependency(model) {
        this.modelDependencies.push(model);
    }
}
exports.JavaDependencyManager = JavaDependencyManager;
//# sourceMappingURL=JavaDependencyManager.js.map