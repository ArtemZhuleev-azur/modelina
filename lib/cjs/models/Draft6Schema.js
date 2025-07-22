"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Draft6Schema = void 0;
/**
 * JSON Draft 6 schema model
 */
class Draft6Schema {
    /**
     * Takes a deep copy of the input object and converts it to an instance of Draft6Schema.
     *
     * @param object
     */
    static toSchema(object) {
        const convertedSchema = Draft6Schema.internalToSchema(object);
        if (convertedSchema instanceof Draft6Schema) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of Draft6Schema');
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
                copy[Number(i)] = Draft6Schema.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new Draft6Schema();
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
                        copyProp[String(propName2)] = Draft6Schema.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = Draft6Schema.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
}
exports.Draft6Schema = Draft6Schema;
//# sourceMappingURL=Draft6Schema.js.map