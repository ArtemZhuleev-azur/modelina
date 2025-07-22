"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
const helpers_1 = require("../../helpers");
class TypeScriptDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
    /**
     * Simple helper function to add a dependency correct based on the module system that the user defines.
     */
    addTypeScriptDependency(toImport, fromModule) {
        const dependencyImport = this.renderDependency(toImport, fromModule);
        this.addDependency(dependencyImport);
    }
    /**
     * Simple helper function to render a dependency based on the module system that the user defines.
     */
    renderDependency(toImport, fromModule) {
        return (0, helpers_1.renderJavaScriptDependency)(toImport, fromModule, this.options.moduleSystem);
    }
    /**
     * Render the model dependencies based on the option
     */
    renderCompleteModelDependencies(model, exportType) {
        const dependencyObject = exportType === 'named' ? `{${model.name}}` : model.name;
        return this.renderDependency(dependencyObject, `./${model.name}`);
    }
    /**
     * Render the exported statement for the model based on the options
     */
    renderExport(model, exportType) {
        const cjsExport = exportType === 'default'
            ? `module.exports = ${model.name};`
            : `exports.${model.name} = ${model.name};`;
        const esmExport = exportType === 'default'
            ? `export default ${model.name};\n`
            : `export { ${model.name} };`;
        return this.options.moduleSystem === 'CJS' ? cjsExport : esmExport;
    }
}
exports.TypeScriptDependencyManager = TypeScriptDependencyManager;
//# sourceMappingURL=TypeScriptDependencyManager.js.map