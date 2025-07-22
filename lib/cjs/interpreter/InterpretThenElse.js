"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
const models_1 = require("../models");
/**
 * Interpreter function for then/else keywords.
 *
 * It merges schemas into existing model
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function InterpretThenElse(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' ||
        schema instanceof models_1.Draft4Schema ||
        schema instanceof models_1.Draft6Schema) {
        return;
    }
    if (schema.then) {
        interpretThenElseItem(schema.then, model, interpreter, interpreterOptions);
    }
    if (schema.else) {
        interpretThenElseItem(schema.else, model, interpreter, interpreterOptions);
    }
}
exports.default = InterpretThenElse;
function interpretThenElseItem(thenOrElseSchema, model, interpreter, interpreterOptions) {
    if (typeof thenOrElseSchema === 'boolean' ||
        thenOrElseSchema instanceof models_1.Draft4Schema ||
        thenOrElseSchema instanceof models_1.Draft6Schema) {
        return;
    }
    interpreter.interpretAndCombineSchema(thenOrElseSchema, model, thenOrElseSchema, interpreterOptions, {
        constrictModels: false
    });
}
//# sourceMappingURL=InterpretThenElse.js.map