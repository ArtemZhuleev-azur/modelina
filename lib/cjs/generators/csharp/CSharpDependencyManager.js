"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class CSharpDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
}
exports.CSharpDependencyManager = CSharpDependencyManager;
//# sourceMappingURL=CSharpDependencyManager.js.map