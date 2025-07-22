"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for patternProperties keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretPatternProperties(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean') {
        return;
    }
    for (const [pattern, patternSchema] of Object.entries(schema.patternProperties || {})) {
        const patternModel = interpreter.interpret(patternSchema, interpreterOptions);
        if (patternModel !== undefined) {
            model.addPatternProperty(pattern, patternModel, schema);
        }
    }
}
exports.default = interpretPatternProperties;
//# sourceMappingURL=InterpretPatternProperties.js.map