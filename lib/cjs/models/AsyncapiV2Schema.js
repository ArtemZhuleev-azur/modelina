"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncapiV2Schema = exports.AsyncapiV2ExternalDocumentation = void 0;
class AsyncapiV2ExternalDocumentation {
    static toExternalDocumentation(object) {
        const doc = new AsyncapiV2ExternalDocumentation();
        for (const [propName, prop] of Object.entries(object)) {
            doc[String(propName)] = prop;
        }
        return doc;
    }
}
exports.AsyncapiV2ExternalDocumentation = AsyncapiV2ExternalDocumentation;
/**
 * AsyncAPI schema model
 *
 * Based on Draft 7 with additions
 *
 * https://www.asyncapi.com/docs/specifications/v2.0.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.1.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.2.0#schemaObject
 * https://www.asyncapi.com/docs/specifications/v2.3.0#schemaObject
 */
class AsyncapiV2Schema {
    /**
     * Takes a deep copy of the input object and converts it to an instance of AsyncapiV2Schema.
     *
     * @param object
     */
    static toSchema(object) {
        const convertedSchema = AsyncapiV2Schema.internalToSchema(object);
        if (convertedSchema instanceof AsyncapiV2Schema) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of AsyncapiV2Schema');
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
                copy[Number(i)] = AsyncapiV2Schema.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new AsyncapiV2Schema();
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
                // Custom convert to External documentation instance
                if (propName === 'externalDocs') {
                    schema.externalDocs =
                        AsyncapiV2ExternalDocumentation.toExternalDocumentation(prop);
                    continue;
                }
                else if (propName === 'properties' ||
                    propName === 'patternProperties' ||
                    propName === 'definitions' ||
                    propName === 'dependencies') {
                    // Special cases are properties that should be a basic object
                    copyProp = {};
                    for (const [propName2, prop2] of Object.entries(prop)) {
                        copyProp[String(propName2)] = AsyncapiV2Schema.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = AsyncapiV2Schema.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
}
exports.AsyncapiV2Schema = AsyncapiV2Schema;
//# sourceMappingURL=AsyncapiV2Schema.js.map