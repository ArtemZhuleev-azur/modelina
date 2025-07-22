"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class RustDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
}
exports.RustDependencyManager = RustDependencyManager;
//# sourceMappingURL=RustDependencyManager.js.map