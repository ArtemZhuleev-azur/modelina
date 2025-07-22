"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhpDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class PhpDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
}
exports.PhpDependencyManager = PhpDependencyManager;
//# sourceMappingURL=PhpDependencyManager.js.map