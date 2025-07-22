"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptDependencyManager = void 0;
const helpers_1 = require("../../helpers");
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class JavaScriptDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
    /**
     * Simple helper function to render a dependency based on the module system that the user defines.
     */
    renderDependency(toImport, fromModule) {
        return (0, helpers_1.renderJavaScriptDependency)(toImport, fromModule, this.options.moduleSystem);
    }
}
exports.JavaScriptDependencyManager = JavaScriptDependencyManager;
//# sourceMappingURL=JavaScriptDependencyManager.js.map