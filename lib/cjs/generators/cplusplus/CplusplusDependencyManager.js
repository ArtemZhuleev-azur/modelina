"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CplusplusDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class CplusplusDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
}
exports.CplusplusDependencyManager = CplusplusDependencyManager;
//# sourceMappingURL=CplusplusDependencyManager.js.map