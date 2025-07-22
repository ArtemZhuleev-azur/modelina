"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDependencyManager = void 0;
class AbstractDependencyManager {
    constructor(dependencies = []) {
        this.dependencies = dependencies;
    }
    /**
     * Adds a dependency while ensuring that unique dependencies.
     *
     * @param dependency complete dependency string so it can be rendered as is.
     */
    addDependency(dependency) {
        if (!this.dependencies.includes(dependency)) {
            this.dependencies.push(dependency);
        }
    }
}
exports.AbstractDependencyManager = AbstractDependencyManager;
//# sourceMappingURL=AbstractDependencyManager.js.map