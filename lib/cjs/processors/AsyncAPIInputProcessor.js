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
exports.AsyncAPIInputProcessor = void 0;
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const parser_1 = require("@asyncapi/parser");
const js_yaml_1 = __importDefault(require("js-yaml"));
const AbstractInputProcessor_1 = require("./AbstractInputProcessor");
const JsonSchemaInputProcessor_1 = require("./JsonSchemaInputProcessor");
const models_1 = require("../models");
const utils_1 = require("../utils");
const AsyncapiV2Schema_1 = require("../models/AsyncapiV2Schema");
const fs_1 = __importDefault(require("fs"));
const url_1 = require("url");
const multi_parser_1 = require("@asyncapi/multi-parser");
const utils_2 = require("@asyncapi/parser/cjs/utils");
/**
 * Class for processing AsyncAPI inputs
 */
class AsyncAPIInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    /**
     * Process the input as an AsyncAPI document
     *
     * @param input
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    process(input, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rawInput = input;
            let doc;
            if (!this.shouldProcess(rawInput)) {
                throw new Error('Input is not an AsyncAPI document so it cannot be processed.');
            }
            utils_1.Logger.debug('Processing input as an AsyncAPI document');
            const inputModel = new models_1.InputMetaModel();
            if ((0, parser_1.isOldAsyncAPIDocument)(rawInput)) {
                // Is from old parser
                const parsedJSON = rawInput.json();
                const detailed = (0, utils_2.createDetailedAsyncAPI)(parsedJSON, parsedJSON);
                doc = (0, parser_1.createAsyncAPIDocument)(detailed);
            }
            else if (AsyncAPIInputProcessor.isFromNewParser(rawInput)) {
                doc = (0, multi_parser_1.ConvertDocumentParserAPIVersion)(rawInput, 2);
            }
            else {
                const parserOptions = (options === null || options === void 0 ? void 0 : options.asyncapi) || {};
                const parser = (0, multi_parser_1.NewParser)(3, {
                    parserOptions,
                    includeSchemaParsers: true
                });
                let parserResult;
                if (this.isFileInput(input)) {
                    const filePath = (0, url_1.fileURLToPath)(input);
                    /* eslint-disable-next-line security/detect-non-literal-fs-filename -- Safe as it just checks file existance */
                    if (!fs_1.default.existsSync(filePath)) {
                        throw new Error('File does not exists.');
                    }
                    parserResult = yield (0, parser_1.fromFile)(parser, filePath).parse();
                }
                else {
                    parserResult = yield parser.parse(rawInput, parserOptions);
                }
                const { document, diagnostics } = parserResult;
                if (document) {
                    doc = document;
                }
                else {
                    const err = new Error('Input is not an correct AsyncAPI document so it cannot be processed.');
                    err.diagnostics = diagnostics;
                    throw err;
                }
            }
            if (!doc) {
                throw new Error('Could not parse input as AsyncAPI document');
            }
            inputModel.originalInput = doc;
            const addToInputModel = (payload) => {
                const schema = AsyncAPIInputProcessor.convertToInternalSchema(payload);
                const newMetaModel = JsonSchemaInputProcessor_1.JsonSchemaInputProcessor.convertSchemaToMetaModel(schema, options);
                if (inputModel.models[newMetaModel.name] !== undefined) {
                    utils_1.Logger.warn(`Overwriting existing model with name ${newMetaModel.name}, are there two models with the same name present? Overwriting the old model.`, newMetaModel.name);
                }
                inputModel.models[newMetaModel.name] = newMetaModel;
            };
            // Go over all the message payloads and convert them to models
            const channels = doc.channels();
            if (channels.length) {
                for (const channel of doc.channels()) {
                    for (const operation of channel.operations()) {
                        const handleMessages = (messages) => {
                            // treat multiple messages as oneOf
                            if (messages.length > 1) {
                                const oneOf = [];
                                for (const message of messages) {
                                    const payload = message.payload();
                                    if (!payload) {
                                        continue;
                                    }
                                    oneOf.push(payload.json());
                                }
                                const payload = new parser_1.SchemaV2({
                                    $id: channel.id(),
                                    oneOf
                                }, channel.meta());
                                addToInputModel(payload);
                            }
                            else if (messages.length === 1) {
                                const payload = messages[0].payload();
                                if (payload) {
                                    addToInputModel(payload);
                                }
                            }
                        };
                        const replyOperation = operation.reply();
                        if (replyOperation !== undefined) {
                            const replyMessages = replyOperation.messages();
                            if (replyMessages.length > 0) {
                                handleMessages(replyMessages);
                            }
                            else {
                                const replyChannelMessages = (_a = replyOperation.channel()) === null || _a === void 0 ? void 0 : _a.messages();
                                if (replyChannelMessages) {
                                    handleMessages(replyChannelMessages);
                                }
                            }
                        }
                        handleMessages(operation.messages());
                    }
                }
            }
            else {
                for (const message of doc.allMessages()) {
                    const payload = message.payload();
                    if (payload) {
                        addToInputModel(payload);
                    }
                }
            }
            return inputModel;
        });
    }
    /**
     *
     * Reflect the name of the schema and save it to `x-modelgen-inferred-name` extension.
     *
     * This keeps the the id of the model deterministic if used in conjunction with other AsyncAPI tools such as the generator.
     *
     * @param schema to reflect name for
     */
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    static convertToInternalSchema(schema, alreadyIteratedSchemas = new Map()) {
        if (typeof schema === 'boolean') {
            return schema;
        }
        let schemaUid = schema.id();
        //Because the constraint functionality of generators cannot handle -, <, >, we remove them from the id if it's an anonymous schema.
        if (typeof schemaUid !== 'undefined' &&
            schemaUid.includes('<anonymous-schema')) {
            schemaUid = schemaUid
                .replace('<', '')
                .replace(/-/g, '_')
                .replace('>', '');
        }
        if (alreadyIteratedSchemas.has(schemaUid)) {
            return alreadyIteratedSchemas.get(schemaUid);
        }
        const convertedSchema = AsyncapiV2Schema_1.AsyncapiV2Schema.toSchema(schema.json());
        convertedSchema[this.MODELGEN_INFFERED_NAME] = schemaUid;
        alreadyIteratedSchemas.set(schemaUid, convertedSchema);
        if (schema.allOf()) {
            convertedSchema.allOf = schema
                .allOf()
                .map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
        }
        if (schema.oneOf()) {
            convertedSchema.oneOf = schema
                .oneOf()
                .map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
        }
        if (schema.anyOf()) {
            convertedSchema.anyOf = schema
                .anyOf()
                .map((item) => this.convertToInternalSchema(item, alreadyIteratedSchemas));
        }
        if (schema.not()) {
            convertedSchema.not = this.convertToInternalSchema(schema.not(), alreadyIteratedSchemas);
        }
        if (typeof schema.additionalItems() === 'object' &&
            schema.additionalItems() !== null) {
            convertedSchema.additionalItems = this.convertToInternalSchema(schema.additionalItems(), alreadyIteratedSchemas);
        }
        if (schema.contains()) {
            convertedSchema.contains = this.convertToInternalSchema(schema.contains(), alreadyIteratedSchemas);
        }
        if (schema.propertyNames()) {
            convertedSchema.propertyNames = this.convertToInternalSchema(schema.propertyNames(), alreadyIteratedSchemas);
        }
        if (schema.if()) {
            convertedSchema.if = this.convertToInternalSchema(schema.if(), alreadyIteratedSchemas);
        }
        if (schema.then()) {
            convertedSchema.then = this.convertToInternalSchema(schema.then(), alreadyIteratedSchemas);
        }
        if (schema.else()) {
            convertedSchema.else = this.convertToInternalSchema(schema.else(), alreadyIteratedSchemas);
        }
        if (typeof schema.additionalProperties() === 'object' &&
            schema.additionalProperties() !== null) {
            convertedSchema.additionalProperties = this.convertToInternalSchema(schema.additionalProperties(), alreadyIteratedSchemas);
        }
        if (schema.items()) {
            if (Array.isArray(schema.items())) {
                convertedSchema.items = schema.items().map((item) => this.convertToInternalSchema(item), alreadyIteratedSchemas);
            }
            else {
                convertedSchema.items = this.convertToInternalSchema(schema.items(), alreadyIteratedSchemas);
            }
        }
        const schemaProperties = schema.properties();
        if (schemaProperties && Object.keys(schemaProperties).length) {
            const properties = {};
            for (const [propertyName, propertySchema] of Object.entries(schemaProperties)) {
                properties[String(propertyName)] = this.convertToInternalSchema(propertySchema, alreadyIteratedSchemas);
            }
            convertedSchema.properties = properties;
        }
        const schemaDependencies = schema.dependencies();
        if (schemaDependencies && Object.keys(schemaDependencies).length) {
            const dependencies = {};
            for (const [dependencyName, dependency] of Object.entries(schemaDependencies)) {
                if (typeof dependency === 'object' && !Array.isArray(dependency)) {
                    dependencies[String(dependencyName)] = this.convertToInternalSchema(dependency, alreadyIteratedSchemas);
                }
                else {
                    dependencies[String(dependencyName)] = dependency;
                }
            }
            convertedSchema.dependencies = dependencies;
        }
        const schemaPatternProperties = schema.patternProperties();
        if (schemaPatternProperties &&
            Object.keys(schemaPatternProperties).length) {
            const patternProperties = {};
            for (const [patternPropertyName, patternProperty] of Object.entries(schemaPatternProperties)) {
                patternProperties[String(patternPropertyName)] =
                    this.convertToInternalSchema(patternProperty, alreadyIteratedSchemas);
            }
            convertedSchema.patternProperties = patternProperties;
        }
        const schemaDefinitions = schema.definitions();
        if (schemaDefinitions && Object.keys(schemaDefinitions).length) {
            const definitions = {};
            for (const [definitionName, definition] of Object.entries(schemaDefinitions)) {
                definitions[String(definitionName)] = this.convertToInternalSchema(definition, alreadyIteratedSchemas);
            }
            convertedSchema.definitions = definitions;
        }
        return convertedSchema;
    }
    /**
     * Figures out if an object is of type AsyncAPI document
     *
     * @param input
     */
    shouldProcess(input) {
        if (!input) {
            return false;
        }
        if (this.isFileInput(input)) {
            return true;
        }
        const version = this.tryGetVersionOfDocument(input);
        if (!version) {
            return false;
        }
        return AsyncAPIInputProcessor.supportedVersions.includes(version);
    }
    /**
     * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
     *
     * @param input
     */
    tryGetVersionOfDocument(input) {
        if (!input) {
            return;
        }
        if (typeof input === 'string') {
            //If string input, it could be stringified JSON or YAML format, lets check
            let loadedObj;
            try {
                loadedObj = js_yaml_1.default.load(input);
            }
            catch (e) {
                try {
                    loadedObj = JSON.parse(input);
                }
                catch (e) {
                    return undefined;
                }
            }
            return loadedObj === null || loadedObj === void 0 ? void 0 : loadedObj.asyncapi;
        }
        if (AsyncAPIInputProcessor.isFromParser(input)) {
            return input.version();
        }
        return input === null || input === void 0 ? void 0 : input.asyncapi;
    }
    /**
     * Figure out if input is from the AsyncAPI parser.
     *
     * @param input
     */
    static isFromParser(input) {
        return (0, parser_1.isOldAsyncAPIDocument)(input) || this.isFromNewParser(input);
    }
    /**
     * Figure out if input is from the new AsyncAPI parser.
     *
     * @param input
     */
    static isFromNewParser(input) {
        return (0, parser_1.isAsyncAPIDocument)(input);
    }
    isFileInput(input) {
        // prettier-ignore
        return typeof input === 'string' && (/^file:\/\//g).test(input);
    }
}
exports.AsyncAPIInputProcessor = AsyncAPIInputProcessor;
AsyncAPIInputProcessor.supportedVersions = [
    '2.0.0',
    '2.1.0',
    '2.2.0',
    '2.3.0',
    '2.4.0',
    '2.5.0',
    '2.6.0',
    '3.0.0'
];
//# sourceMappingURL=AsyncAPIInputProcessor.js.map