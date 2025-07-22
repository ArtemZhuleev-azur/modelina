"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUnique = exports.renderJavaScriptDependency = void 0;
/**
 * Function to make it easier to render JS/TS dependencies based on module system
 *
 * @param toImport
 * @param fromModule
 * @param moduleSystem
 */
function renderJavaScriptDependency(toImport, fromModule, moduleSystem) {
    return moduleSystem === 'CJS'
        ? `const ${toImport} = require('${fromModule}');`
        : `import ${toImport} from '${fromModule}';`;
}
exports.renderJavaScriptDependency = renderJavaScriptDependency;
/**
 * Function to make an array of ConstrainedMetaModels only contain unique values (ignores different in memory instances)
 *
 * @param array to make unique
 */
function makeUnique(array) {
    const seen = new Set();
    return array.filter((item) => {
        const naiveIdentifier = item.name + item.type;
        return seen.has(naiveIdentifier) ? false : seen.add(naiveIdentifier);
    });
}
exports.makeUnique = makeUnique;
//# sourceMappingURL=DependencyHelpers.js.map