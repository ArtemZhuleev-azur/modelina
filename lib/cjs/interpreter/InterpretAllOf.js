"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Interpreter_1 = require("./Interpreter");
const Utils_1 = require("./Utils");
/**
 * Interpreter function for allOf keyword.
 *
 * It either merges allOf schemas into existing model or if allowed, create inheritance.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function interpretAllOf(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' ||
        schema.allOf === undefined ||
        schema.oneOf) {
        return;
    }
    for (const subSchema of schema.allOf) {
        const discriminator = interpreter.discriminatorProperty(subSchema);
        if (discriminator !== undefined) {
            interpreterOptions = Object.assign(Object.assign({}, interpreterOptions), { discriminator });
            model.discriminator = discriminator;
        }
    }
    if (interpreterOptions.allowInheritance &&
        interpreterOptions.disableCache === true) {
        throw new Error(`Inheritance is enabled in combination with allOf but cache is disabled. Inheritance will not work as expected.`);
    }
    // Interpret each sub-schema in allOf
    for (const subSchema of schema.allOf) {
        const subModel = interpreter.interpret(subSchema, interpreterOptions);
        if (!subModel) {
            continue;
        }
        // If inheritance is allowed, add subModel as an extended model
        if (interpreterOptions.allowInheritance) {
            const freshModel = interpreter.interpret(subSchema, Object.assign({}, interpreterOptions));
            if (freshModel && (0, Utils_1.isModelObject)(freshModel)) {
                utils_1.Logger.info(`Processing allOf, inheritance is enabled, ${model.$id} inherits from ${freshModel.$id}`, model, subModel);
                model.addExtendedModel(freshModel);
            }
        }
        utils_1.Logger.info('Processing allOf, inheritance is not enabled. AllOf model is merged together with already interpreted model', model, subModel);
        interpreter.interpretAndCombineSchema(subSchema, model, schema, interpreterOptions);
    }
}
exports.default = interpretAllOf;
//# sourceMappingURL=InterpretAllOf.js.map