"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class GoDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
}
exports.GoDependencyManager = GoDependencyManager;
//# sourceMappingURL=GoDependencyManager.js.map