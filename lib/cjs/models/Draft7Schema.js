"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Draft7Schema = void 0;
/**
 * JSON Draft7Schema Draft 7 model
 */
class Draft7Schema {
    /**
     * Takes a deep copy of the input object and converts it to an instance of Draft7Schema.
     *
     * @param object
     */
    static toSchema(object) {
        const convertedSchema = Draft7Schema.internalToSchema(object);
        if (convertedSchema instanceof Draft7Schema) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of Draft7Schema');
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
                copy[Number(i)] = Draft7Schema.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new Draft7Schema();
        seenSchemas.set(object, schema);
        for (const [propName, prop] of Object.entries(object)) {
            if (prop === undefined) {
                continue;
            }
            let copyProp = prop;
            // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
            if (propName !== 'default' &&
                propName !== 'examples' &&
                propName !== 'const' &&
                propName !== 'enum') {
                // Special cases are properties that should be a basic object
                if (propName === 'properties' ||
                    propName === 'patternProperties' ||
                    propName === 'definitions' ||
                    propName === 'dependencies') {
                    copyProp = {};
                    for (const [propName2, prop2] of Object.entries(prop)) {
                        copyProp[String(propName2)] = Draft7Schema.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = Draft7Schema.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
}
exports.Draft7Schema = Draft7Schema;
//# sourceMappingURL=Draft7Schema.js.map