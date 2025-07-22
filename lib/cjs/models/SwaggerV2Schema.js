"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerV2Schema = exports.SwaggerV2ExternalDocumentation = exports.SwaggerV2Xml = void 0;
class SwaggerV2Xml {
    static toXml(object) {
        let doc = new SwaggerV2Xml();
        doc = Object.assign(doc, object);
        return doc;
    }
}
exports.SwaggerV2Xml = SwaggerV2Xml;
class SwaggerV2ExternalDocumentation {
    static toExternalDocumentation(object) {
        let doc = new SwaggerV2ExternalDocumentation();
        doc = Object.assign(doc, object);
        return doc;
    }
}
exports.SwaggerV2ExternalDocumentation = SwaggerV2ExternalDocumentation;
/**
 * OpenAPI 2.0 (Swagger 2.0) schema model
 *
 * Based on Draft 4, but with restricted keywords and definitions
 *
 * Restrictions (keywords not allowed)
 *  - oneOf
 *  - anyOf
 *  - patternProperties
 *  - not
 *
 * https://swagger.io/specification/v2/#schemaObject
 */
class SwaggerV2Schema {
    /**
     * Takes a deep copy of the input object and converts it to an instance of SwaggerV2Schema.
     *
     * @param object
     */
    static toSchema(object) {
        const convertedSchema = SwaggerV2Schema.internalToSchema(object);
        if (convertedSchema instanceof SwaggerV2Schema) {
            return convertedSchema;
        }
        throw new Error('Could not convert input to expected copy of SwaggerV2Schema');
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
                copy[Number(i)] = SwaggerV2Schema.internalToSchema(object[Number(i)], seenSchemas);
            }
            return copy;
        }
        //Nothing else left then to create an object
        const schema = new SwaggerV2Schema();
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
                        SwaggerV2ExternalDocumentation.toExternalDocumentation(prop);
                    continue;
                }
                else if (propName === 'xml') {
                    schema.xml = SwaggerV2Xml.toXml(prop);
                    continue;
                }
                else if (propName === 'properties' ||
                    propName === 'patternProperties' ||
                    propName === 'definitions' ||
                    propName === 'dependencies') {
                    // Special cases are properties that should be a basic object
                    copyProp = {};
                    for (const [propName2, prop2] of Object.entries(prop)) {
                        copyProp[String(propName2)] = SwaggerV2Schema.internalToSchema(prop2, seenSchemas);
                    }
                }
                else {
                    copyProp = SwaggerV2Schema.internalToSchema(prop, seenSchemas);
                }
            }
            schema[String(propName)] = copyProp;
        }
        return schema;
    }
}
exports.SwaggerV2Schema = SwaggerV2Schema;
//# sourceMappingURL=SwaggerV2Schema.js.map