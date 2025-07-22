"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for oneOf keyword combined with properties.
 *
 * It merges the properties of the schema into the oneOf schemas. Shared properties are merged. The oneOf schemas are then added as union to the model.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretOneOfWithProperties(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' ||
        !schema.oneOf ||
        !schema.properties ||
        schema.allOf) {
        return;
    }
    const discriminator = interpreter.discriminatorProperty(schema);
    interpreterOptions = Object.assign(Object.assign({}, interpreterOptions), { discriminator });
    model.discriminator = discriminator;
    for (const oneOfSchema of schema.oneOf) {
        const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
        if (!oneOfModel) {
            continue;
        }
        const schemaModel = interpreter.interpret(Object.assign(Object.assign({}, schema), { oneOf: undefined }), interpreterOptions);
        if (!schemaModel) {
            continue;
        }
        interpreter.interpretAndCombineSchema(oneOfSchema, schemaModel, schema, interpreterOptions);
        model.setType(undefined);
        schemaModel.$id = oneOfModel.$id;
        model.addItemUnion(schemaModel);
    }
}
exports.default = interpretOneOfWithProperties;
//# sourceMappingURL=InterpretOneOfWithProperties.js.map