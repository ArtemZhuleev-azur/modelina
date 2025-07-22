"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for oneOf keyword.
 *
 * It puts the schema reference into the items field.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretOneOf(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' ||
        schema.oneOf === undefined ||
        schema.allOf ||
        schema.properties) {
        return;
    }
    const discriminator = interpreter.discriminatorProperty(schema);
    interpreterOptions = Object.assign(Object.assign({}, interpreterOptions), { discriminator });
    model.discriminator = discriminator;
    for (const oneOfSchema of schema.oneOf) {
        const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
        if (oneOfModel === undefined) {
            continue;
        }
        if (oneOfModel.discriminator) {
            model.discriminator = oneOfModel.discriminator;
        }
        model.addItemUnion(oneOfModel);
    }
}
exports.default = interpretOneOf;
//# sourceMappingURL=InterpretOneOf.js.map