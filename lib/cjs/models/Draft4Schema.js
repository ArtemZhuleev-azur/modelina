"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Draft4Schema = void 0;
/**
 * JSON Draft 4 schema model
 */
class Draft4Schema {
    /**
     * Takes a deep copy of the input object and converts it to an instance of Draft4Schema.
     *
     * @param object
     */
    static toSchema(object) {
        const convertedSchema = Draft4Schema.internalToSchema(object);
        if (convertedSchema instanceof Draft4Schema) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of Draft4Schema');
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static internalToSchema(object, seenSchemas = new Map()) {
        // if primitive types return as is
        if (null === object || 'object' !== typeof object) {
            return object;
        }
        if (seenSchemas.has(object)) {
            return seenSchemas.get(object);
        }
        if (object instanceof Array) {
            const copy = [];
            for (let i = 0, len = object.length; i < len; i++) {
                copy[Number(i)] = Draft4Schema.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new Draft4Schema();
        seenSchemas.set(object, schema);
        for (const [propName, prop] of Object.entries(object)) {
            if (prop === undefined) {
                continue;
            }
            let copyProp = prop;
            // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
            if (propName !== 'default' && propName !== 'enum') {
                // Special cases are properties that should be a basic object
                if (propName === 'properties' ||
                    propName === 'patternProperties' ||
                    propName === 'definitions' ||
                    propName === 'dependencies') {
                    copyProp = {};
                    for (const [propName2, prop2] of Object.entries(prop)) {
                        copyProp[String(propName2)] = Draft4Schema.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = Draft4Schema.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
}
exports.Draft4Schema = Draft4Schema;
//# sourceMappingURL=Draft4Schema.js.map