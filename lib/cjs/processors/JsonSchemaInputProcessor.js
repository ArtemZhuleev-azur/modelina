"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonSchemaInputProcessor = exports.defaultJsonSchemaProcessorOptions = void 0;
const AbstractInputProcessor_1 = require("./AbstractInputProcessor");
const json_schema_ref_parser_1 = require("@apidevtools/json-schema-ref-parser");
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const Interpreter_1 = require("../interpreter/Interpreter");
const helpers_1 = require("../helpers");
exports.defaultJsonSchemaProcessorOptions = {
    allowInheritance: false,
    disableCache: false,
    ignoreAdditionalItems: false,
    ignoreAdditionalProperties: false,
    interpretSingleEnumAsConst: false,
    propertyNameForAdditionalProperties: 'additionalProperties'
};
/**
 * Class for processing JSON Schema
 */
class JsonSchemaInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    /**
     * Function for processing a JSON Schema input.
     *
     * @param input
     */
    process(input, options) {
        if (this.shouldProcess(input)) {
            switch (input.$schema) {
                case 'http://json-schema.org/draft-04/schema':
                case 'http://json-schema.org/draft-04/schema#':
                    return this.processDraft4(input, options);
                case 'http://json-schema.org/draft-06/schema':
                case 'http://json-schema.org/draft-06/schema#':
                    return this.processDraft6(input, options);
                case 'http://json-schema.org/draft-07/schema#':
                case 'http://json-schema.org/draft-07/schema':
                default:
                    return this.processDraft7(input, options);
            }
        }
        return Promise.reject(new Error('Input is not a JSON Schema, so it cannot be processed.'));
    }
    /**
     * Unless the schema states one that is not supported we assume its of type JSON Schema
     *
     * @param input
     */
    shouldProcess(input) {
        if (input.$schema !== undefined) {
            if (input.$schema === 'http://json-schema.org/draft-04/schema#' ||
                input.$schema === 'http://json-schema.org/draft-04/schema' ||
                input.$schema === 'http://json-schema.org/draft-06/schema#' ||
                input.$schema === 'http://json-schema.org/draft-06/schema' ||
                input.$schema === 'http://json-schema.org/draft-07/schema#' ||
                input.$schema === 'http://json-schema.org/draft-07/schema') {
                return true;
            }
            return false;
        }
        return true;
    }
    /**
     * Process a draft-7 schema
     *
     * @param input to process as draft 7
     */
    processDraft7(input, options) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.Logger.debug('Processing input as a JSON Schema Draft 7 document');
            const inputModel = new models_1.InputMetaModel();
            inputModel.originalInput = input;
            input = JsonSchemaInputProcessor.reflectSchemaNames(input, {}, new Set(), 'root', true);
            input = yield this.dereferenceInputs(input);
            const parsedSchema = models_1.Draft7Schema.toSchema(input);
            const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(parsedSchema, options);
            inputModel.models[metaModel.name] = metaModel;
            utils_1.Logger.debug('Completed processing input as JSON Schema draft 7 document');
            return inputModel;
        });
    }
    /**
     * Process a draft-4 schema
     *
     * @param input to process as draft 4
     */
    processDraft4(input, options) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.Logger.debug('Processing input as JSON Schema Draft 4 document');
            const inputModel = new models_1.InputMetaModel();
            inputModel.originalInput = input;
            input = JsonSchemaInputProcessor.reflectSchemaNames(input, {}, new Set(), 'root', true);
            input = yield this.dereferenceInputs(input);
            const parsedSchema = models_1.Draft4Schema.toSchema(input);
            const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(parsedSchema, options);
            inputModel.models[metaModel.name] = metaModel;
            utils_1.Logger.debug('Completed processing input as JSON Schema draft 4 document');
            return inputModel;
        });
    }
    /**
     * Process a draft-6 schema
     *
     * @param input to process as draft-6
     */
    processDraft6(input, options) {
        return __awaiter(this, void 0, void 0, function* () {
            utils_1.Logger.debug('Processing input as a JSON Schema Draft 6 document');
            const inputModel = new models_1.InputMetaModel();
            inputModel.originalInput = input;
            input = JsonSchemaInputProcessor.reflectSchemaNames(input, {}, new Set(), 'root', true);
            input = yield this.dereferenceInputs(input);
            const parsedSchema = models_1.Draft6Schema.toSchema(input);
            const metaModel = JsonSchemaInputProcessor.convertSchemaToMetaModel(parsedSchema, options);
            inputModel.models[metaModel.name] = metaModel;
            utils_1.Logger.debug('Completed processing input as JSON Schema draft 6 document');
            return inputModel;
        });
    }
    /**
     * This is a hotfix and really only a partial solution as it does not cover all cases.
     *
     * But it's the best we can do until we find or build a better library to handle references.
     */
    handleRootReference(input) {
        //Because of https://github.com/APIDevTools/json-schema-ref-parser/issues/201 the tool cannot handle root references.
        //This really is a bad patch to fix an underlying problem, but until a full library is available, this is best we can do.
        const hasRootRef = input.$ref !== undefined;
        if (hasRootRef) {
            utils_1.Logger.warn('Found a root $ref, which is not fully supported in Modelina, trying to do what I can with it...');
            //When we encounter it, manually try to resolve the reference in the definitions section
            const hasDefinitionSection = input.definitions !== undefined;
            if (hasDefinitionSection) {
                const definitionLink = '#/definitions/';
                const referenceLink = input.$ref.slice(0, definitionLink.length);
                const referenceIsLocal = referenceLink === definitionLink;
                if (referenceIsLocal) {
                    const definitionName = input.$ref.slice(definitionLink.length);
                    const definition = input.definitions[String(definitionName)];
                    const definitionExist = definition !== undefined;
                    if (definitionExist) {
                        delete input.$ref;
                        return Object.assign(Object.assign({}, definition), input);
                    }
                }
            }
            //All other unhandled cases, means we cannot handle this input
            throw new Error('Cannot handle input, because it has a root `$ref`, please manually resolve the first reference.');
        }
        return input;
    }
    dereferenceInputs(input) {
        return __awaiter(this, void 0, void 0, function* () {
            input = this.handleRootReference(input);
            utils_1.Logger.debug('Dereferencing all $ref instances');
            // eslint-disable-next-line no-undef
            const localPath = `${process.cwd()}${path_1.default.sep}`;
            const deRefOption = {
                continueOnError: true,
                dereference: {
                    circular: true,
                    excludedPathMatcher: (path) => {
                        // References inside examples should not be de-referenced, unless they are a property.
                        return (path.includes('/examples/') &&
                            !path.includes('/properties/examples/'));
                    }
                }
            };
            utils_1.Logger.debug(`Trying to dereference all $ref instances from input, using option ${JSON.stringify(deRefOption)}.`);
            try {
                yield (0, json_schema_ref_parser_1.dereference)(localPath, input, deRefOption);
            }
            catch (e) {
                const errorMessage = `Could not dereference $ref in input, is all the references correct? ${e.message}`;
                utils_1.Logger.error(errorMessage, e);
                throw new Error(errorMessage);
            }
            utils_1.Logger.debug('Successfully dereferenced all $ref instances from input.', input);
            return input;
        });
    }
    /**
     * Each schema must have a name, so when later interpreted, the model have the most accurate model name.
     *
     * Reflect name from given schema and save it to `x-modelgen-inferred-name` extension.
     *
     * This reflects all the common keywords that are shared between draft-4, draft-7 and Swagger 2.0 Schema
     *
     * @param schema to process
     * @param namesStack is a aggregator of previous used names
     * @param seenSchemas is a set of schema already seen and named
     * @param name to infer
     * @param isRoot indicates if performed schema is a root schema
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static reflectSchemaNames(schema, namesStack, seenSchemas, name, isRoot) {
        if (typeof schema === 'boolean') {
            return schema;
        }
        // short-circuit circular references
        if (seenSchemas.has(schema)) {
            return schema;
        }
        seenSchemas.add(schema);
        schema = Object.assign({}, schema);
        if (isRoot) {
            namesStack[String(name)] = 0;
            schema[this.MODELGEN_INFFERED_NAME] = name;
            name = '';
        }
        else if (name &&
            !schema[this.MODELGEN_INFFERED_NAME] &&
            schema.$ref === undefined) {
            let occurrence = namesStack[String(name)];
            if (occurrence === undefined) {
                namesStack[String(name)] = 0;
            }
            else {
                occurrence++;
            }
            const inferredName = occurrence ? `${name}_${occurrence}` : name;
            schema[this.MODELGEN_INFFERED_NAME] = inferredName;
        }
        if (schema.allOf !== undefined) {
            schema.allOf = schema.allOf.map((item, idx) => this.reflectSchemaNames(item, namesStack, seenSchemas, this.ensureNamePattern(name, 'allOf', idx)));
        }
        if (schema.oneOf !== undefined) {
            schema.oneOf = schema.oneOf.map((item, idx) => this.reflectSchemaNames(item, namesStack, seenSchemas, this.ensureNamePattern(name, 'oneOf', idx)));
        }
        if (schema.anyOf !== undefined) {
            schema.anyOf = schema.anyOf.map((item, idx) => this.reflectSchemaNames(item, namesStack, seenSchemas, this.ensureNamePattern(name, 'anyOf', idx)));
        }
        if (schema.not !== undefined) {
            schema.not = this.reflectSchemaNames(schema.not, namesStack, seenSchemas, this.ensureNamePattern(name, 'not'));
        }
        if (typeof schema.additionalItems === 'object' &&
            schema.additionalItems !== undefined) {
            schema.additionalItems = this.reflectSchemaNames(schema.additionalItems, namesStack, seenSchemas, this.ensureNamePattern(name, 'additionalItem'));
        }
        if (typeof schema.additionalProperties === 'object' &&
            schema.additionalProperties !== undefined) {
            schema.additionalProperties = this.reflectSchemaNames(schema.additionalProperties, namesStack, seenSchemas, this.ensureNamePattern(name, 'additionalProperty'));
        }
        if (schema.items !== undefined) {
            if (Array.isArray(schema.items)) {
                schema.items = schema.items.map((item, idx) => this.reflectSchemaNames(item, namesStack, seenSchemas, this.ensureNamePattern(name, 'item', idx)));
            }
            else {
                schema.items = this.reflectSchemaNames(schema.items, namesStack, seenSchemas, this.ensureNamePattern(name, 'item'));
            }
        }
        if (schema.properties !== undefined) {
            const properties = {};
            for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
                properties[String(propertyName)] = this.reflectSchemaNames(propertySchema, namesStack, seenSchemas, this.ensureNamePattern(name, propertyName));
            }
            schema.properties = properties;
        }
        if (schema.dependencies !== undefined) {
            const dependencies = {};
            for (const [dependencyName, dependency] of Object.entries(schema.dependencies)) {
                if (typeof dependency === 'object' && !Array.isArray(dependency)) {
                    dependencies[String(dependencyName)] = this.reflectSchemaNames(dependency, namesStack, seenSchemas, this.ensureNamePattern(name, dependencyName));
                }
                else {
                    dependencies[String(dependencyName)] = dependency;
                }
            }
            schema.dependencies = dependencies;
        }
        if (schema.patternProperties !== undefined) {
            const patternProperties = {};
            for (const [idx, [patternPropertyName, patternProperty]] of Object.entries(Object.entries(schema.patternProperties))) {
                patternProperties[String(patternPropertyName)] =
                    this.reflectSchemaNames(patternProperty, namesStack, seenSchemas, this.ensureNamePattern(name, 'pattern_property', idx));
            }
            schema.patternProperties = patternProperties;
        }
        if (schema.definitions !== undefined) {
            const definitions = {};
            for (const [definitionName, definition] of Object.entries(schema.definitions)) {
                definitions[String(definitionName)] = this.reflectSchemaNames(definition, namesStack, seenSchemas, this.ensureNamePattern(name, definitionName));
            }
            schema.definitions = definitions;
        }
        if (!(schema instanceof models_1.Draft4Schema)) {
            //Keywords introduced in draft 6
            if (schema.contains !== undefined) {
                schema.contains = this.reflectSchemaNames(schema.contains, namesStack, seenSchemas, this.ensureNamePattern(name, 'contain'));
            }
            if (schema.propertyNames !== undefined) {
                schema.propertyNames = this.reflectSchemaNames(schema.propertyNames, namesStack, seenSchemas, this.ensureNamePattern(name, 'propertyName'));
            }
            if (!(schema instanceof models_1.Draft6Schema)) {
                //Keywords introduced in Draft 7
                if (schema.if !== undefined) {
                    schema.if = this.reflectSchemaNames(schema.if, namesStack, seenSchemas, this.ensureNamePattern(name, 'if'));
                }
                if (schema.then !== undefined) {
                    schema.then = this.reflectSchemaNames(schema.then, namesStack, seenSchemas, this.ensureNamePattern(name, 'then'));
                }
                if (schema.else !== undefined) {
                    schema.else = this.reflectSchemaNames(schema.else, namesStack, seenSchemas, this.ensureNamePattern(name, 'else'));
                }
            }
        }
        return schema;
    }
    /**
     * Ensure schema name using previous name and new part
     *
     * @param previousName to concatenate with
     * @param newParts
     */
    static ensureNamePattern(previousName, ...newParts) {
        const pattern = newParts.map((part) => `${part}`).join('_');
        if (!previousName) {
            return pattern;
        }
        return `${previousName}_${pattern}`;
    }
    /**
     * Simplifies a JSON Schema into a common models
     *
     * @param schema to simplify to common model
     */
    static convertSchemaToCommonModel(schema, options) {
        var _a;
        const interpreter = new Interpreter_1.Interpreter();
        const model = interpreter.interpret(schema, (_a = options === null || options === void 0 ? void 0 : options.jsonSchema) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.interpreter);
        if (model === undefined) {
            throw new Error('Could not interpret schema to internal model');
        }
        return model;
    }
    /**
     * Simplifies a JSON Schema into a common models
     *
     * @param schema to simplify to common model
     */
    static convertSchemaToMetaModel(schema, options) {
        const commonModel = this.convertSchemaToCommonModel(schema, options);
        return (0, helpers_1.convertToMetaModel)({
            jsonSchemaModel: commonModel,
            options: Object.assign(Object.assign({}, exports.defaultJsonSchemaProcessorOptions), options === null || options === void 0 ? void 0 : options.jsonSchema),
            alreadySeenModels: new Map()
        });
    }
}
exports.JsonSchemaInputProcessor = JsonSchemaInputProcessor;
//# sourceMappingURL=JsonSchemaInputProcessor.js.map