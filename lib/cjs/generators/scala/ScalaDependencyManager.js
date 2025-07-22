"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalaDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class ScalaDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
    /**
     * Adds a dependency package ensuring correct syntax.
     *
     * @param dependencyPackage package to import, for example `javax.validation.constraints.*`
     */
    addDependency(dependencyPackage) {
        super.addDependency(`import ${dependencyPackage}`);
    }
}
exports.ScalaDependencyManager = ScalaDependencyManager;
//# sourceMappingURL=ScalaDependencyManager.js.map