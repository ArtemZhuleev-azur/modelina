"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class TemplateDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
}
exports.TemplateDependencyManager = TemplateDependencyManager;
//# sourceMappingURL=TemplateDependencyManager.js.map