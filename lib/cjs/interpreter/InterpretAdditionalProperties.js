"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
const Utils_1 = require("./Utils");
/**
 * Interpreter function for additionalProperties keyword.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretAdditionalProperties(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' || (0, Utils_1.isModelObject)(model) === false) {
        return;
    }
    let defaultAdditionalProperties = true;
    const hasProperties = Object.keys(schema.properties || {}).length > 0;
    //Only ignore additionalProperties if the schema already has properties defined, otherwise its gonna be interpreted as a map
    if (hasProperties && interpreterOptions.ignoreAdditionalProperties === true) {
        defaultAdditionalProperties = false;
    }
    const additionalProperties = schema.additionalProperties === undefined
        ? defaultAdditionalProperties
        : schema.additionalProperties;
    const additionalPropertiesModel = interpreter.interpret(additionalProperties, interpreterOptions);
    if (additionalPropertiesModel !== undefined) {
        model.addAdditionalProperty(additionalPropertiesModel, schema);
    }
}
exports.default = interpretAdditionalProperties;
//# sourceMappingURL=InterpretAdditionalProperties.js.map