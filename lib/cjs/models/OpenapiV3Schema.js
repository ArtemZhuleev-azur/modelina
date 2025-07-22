"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenapiV3Schema = exports.OpenapiV3Discriminator = exports.OpenAPIV3ExternalDocumentation = exports.OpenapiV3Xml = void 0;
class OpenapiV3Xml {
    static toXml(object) {
        const doc = new OpenapiV3Xml();
        for (const [propName, prop] of Object.entries(object)) {
            doc[String(propName)] = prop;
        }
        return doc;
    }
}
exports.OpenapiV3Xml = OpenapiV3Xml;
class OpenAPIV3ExternalDocumentation {
    static toExternalDocumentation(object) {
        const doc = new OpenAPIV3ExternalDocumentation();
        for (const [propName, prop] of Object.entries(object)) {
            doc[String(propName)] = prop;
        }
        return doc;
    }
}
exports.OpenAPIV3ExternalDocumentation = OpenAPIV3ExternalDocumentation;
class OpenapiV3Discriminator {
    static toDiscriminator(object) {
        const doc = new OpenapiV3Discriminator();
        for (const [propName, prop] of Object.entries(object)) {
            doc[String(propName)] = prop;
        }
        return doc;
    }
}
exports.OpenapiV3Discriminator = OpenapiV3Discriminator;
/**
 * OpenAPI 3.0 -> 3.0.4 schema model
 *
 * Based on Draft 6, but with restricted keywords and definitions
 * Modifications
 *  - type, cannot be an array nor contain 'null'
 *
 * Restrictions (keywords not allowed)
 *  - patternProperties
 *  - not
 *
 * https://swagger.io/specification/#schema-object
 */
class OpenapiV3Schema {
    /**
     * Takes a deep copy of the input object and converts it to an instance of OpenapiV3Schema.
     *
     * @param object
     */
    static toSchema(object) {
        const convertedSchema = OpenapiV3Schema.internalToSchema(object);
        if (convertedSchema instanceof OpenapiV3Schema) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of OpenapiV3Schema');
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
                copy[Number(i)] = OpenapiV3Schema.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new OpenapiV3Schema();
        seenSchemas.set(object, schema);
        for (const [propName, prop] of Object.entries(object)) {
            if (prop === undefined) {
                continue;
            }
            let copyProp = prop;
            // Ignore value properties (those with `any` type) as they should be saved as is regardless of value
            if (propName !== 'default' && propName !== 'enum') {
                // Custom convert to External documentation instance
                if (propName === 'externalDocs') {
                    schema.externalDocs =
                        OpenAPIV3ExternalDocumentation.toExternalDocumentation(prop);
                    continue;
                }
                else if (propName === 'xml') {
                    schema.xml = OpenapiV3Xml.toXml(prop);
                    continue;
                }
                else if (propName === 'discriminator') {
                    schema.discriminator = OpenapiV3Discriminator.toDiscriminator(prop);
                    continue;
                }
                else if (propName === 'properties' ||
                    propName === 'patternProperties' ||
                    propName === 'definitions' ||
                    propName === 'dependencies') {
                    // Special cases are properties that should be a basic object
                    copyProp = {};
                    for (const [propName2, prop2] of Object.entries(prop)) {
                        copyProp[String(propName2)] = OpenapiV3Schema.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = OpenapiV3Schema.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
}
exports.OpenapiV3Schema = OpenapiV3Schema;
//# sourceMappingURL=OpenapiV3Schema.js.map