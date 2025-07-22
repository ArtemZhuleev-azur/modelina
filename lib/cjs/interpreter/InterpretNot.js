"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for not keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretNot(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean') {
        return;
    }
    if (schema.not === undefined) {
        return;
    }
    if (typeof schema.not === 'object') {
        const notSchema = schema.not;
        const newInterpreterOptions = Object.assign(Object.assign({}, interpreterOptions), { allowInheritance: false });
        const notModel = interpreter.interpret(notSchema, newInterpreterOptions);
        if (notModel !== undefined) {
            if (notModel.type !== undefined) {
                model.removeType(notModel.type);
            }
            if (notModel.enum !== undefined) {
                model.removeEnum(notModel.enum);
            }
        }
    }
    else if (typeof schema.not === 'boolean') {
        utils_1.Logger.warn(`Encountered boolean not schema for model ${model.$id}. This schema are not applied!`, schema);
    }
}
exports.default = interpretNot;
//# sourceMappingURL=InterpretNot.js.map