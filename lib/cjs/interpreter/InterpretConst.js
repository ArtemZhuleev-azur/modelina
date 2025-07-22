"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const Interpreter_1 = require("./Interpreter");
const Utils_1 = require("./Utils");
/**
 * Interpreter function for const keyword for draft version > 4
 *
 * @param schema
 * @param model
 * @param interpreterOptions to control the interpret process
 */
function interpretConst(schema, model, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (schema instanceof models_1.Draft4Schema ||
        typeof schema === 'boolean' ||
        schema.const === undefined) {
        return;
    }
    if ((schema instanceof models_1.AsyncapiV2Schema ||
        schema instanceof models_1.SwaggerV2Schema ||
        schema instanceof models_1.OpenapiV3Schema) &&
        interpreterOptions.discriminator) {
        model.enum = [schema.const];
    }
    model.const = schema.const;
    //If schema does not contain type interpret the schema
    if (schema.type === undefined) {
        const inferredType = (0, Utils_1.inferTypeFromValue)(schema.const);
        if (inferredType !== undefined) {
            model.setType(inferredType);
        }
    }
}
exports.default = interpretConst;
//# sourceMappingURL=InterpretConst.js.map