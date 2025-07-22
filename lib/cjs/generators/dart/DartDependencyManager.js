"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartDependencyManager = void 0;
const helpers_1 = require("../../helpers");
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class DartDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
    renderImport(model, packageName) {
        return `import 'package:${packageName}/${helpers_1.FormatHelpers.snakeCase(model.name)}.dart';`;
    }
    renderAllModelDependencies(model, packageName) {
        return model
            .getNearestDependencies()
            .map((dependencyModel) => {
            return this.renderImport(dependencyModel, packageName);
        })
            .join('\n');
    }
}
exports.DartDependencyManager = DartDependencyManager;
//# sourceMappingURL=DartDependencyManager.js.map