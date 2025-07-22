"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for items keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretItems(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' || schema.items === undefined) {
        return;
    }
    model.addTypes('array');
    interpretArrayItems(schema, schema.items, model, interpreter, interpreterOptions);
}
exports.default = interpretItems;
/**
 * Internal function to process all item schemas
 *
 * @param rootSchema
 * @param itemSchemas
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretArrayItems(rootSchema, itemSchemas, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (Array.isArray(itemSchemas)) {
        for (const [index, itemSchema] of itemSchemas.entries()) {
            const itemModel = interpreter.interpret(itemSchema, interpreterOptions);
            if (itemModel !== undefined) {
                model.addItemTuple(itemModel, rootSchema, index);
            }
        }
    }
    else {
        const itemModel = interpreter.interpret(itemSchemas, interpreterOptions);
        if (itemModel !== undefined) {
            model.addItem(itemModel, rootSchema);
        }
    }
}
//# sourceMappingURL=InterpretItems.js.map