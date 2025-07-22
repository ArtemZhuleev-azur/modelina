"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for dependencies keyword.
 *
 * @param schema
 * @param model
 */
function interpretDependencies(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' || schema.dependencies === undefined) {
        return;
    }
    for (const dependency of Object.values(schema.dependencies)) {
        // Only handle schema dependency and skip property dependencies
        if (!Array.isArray(dependency)) {
            interpreter.interpretAndCombineSchema(dependency, model, schema, interpreterOptions);
        }
    }
}
exports.default = interpretDependencies;
//# sourceMappingURL=InterpretDependencies.js.map