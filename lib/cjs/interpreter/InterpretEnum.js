"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("./Utils");
/**
 * Interpreter function for enum keyword
 *
 * @param schema
 * @param model
 */
function interpretEnum(schema, model) {
    if (typeof schema === 'boolean' || schema.enum === undefined) {
        return;
    }
    for (const enumValue of schema.enum) {
        if (schema.type === undefined) {
            const inferredType = (0, Utils_1.inferTypeFromValue)(enumValue);
            if (inferredType !== undefined) {
                model.addTypes(inferredType);
            }
        }
        model.addEnum(enumValue);
    }
}
exports.default = interpretEnum;
//# sourceMappingURL=InterpretEnum.js.map