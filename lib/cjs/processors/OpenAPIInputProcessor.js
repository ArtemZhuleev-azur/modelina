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
exports.OpenAPIInputProcessor = void 0;
const AbstractInputProcessor_1 = require("./AbstractInputProcessor");
const JsonSchemaInputProcessor_1 = require("./JsonSchemaInputProcessor");
const models_1 = require("../models");
const utils_1 = require("../utils");
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
/**
 * Class for processing OpenAPI inputs
 */
class OpenAPIInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    /**
     * Process the input as a OpenAPI document
     *
     * @param input
     */
    process(input, options) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shouldProcess(input)) {
                throw new Error('Input is not a OpenAPI document so it cannot be processed.');
            }
            utils_1.Logger.debug('Processing input as an OpenAPI document');
            const inputModel = new models_1.InputMetaModel();
            inputModel.originalInput = input;
            const api = (yield swagger_parser_1.default.dereference(input));
            if (api && api.paths) {
                for (const [path, pathObject] of Object.entries(api.paths)) {
                    this.processPath(pathObject, path, inputModel, options);
                }
            }
            if ((_a = options === null || options === void 0 ? void 0 : options.openapi) === null || _a === void 0 ? void 0 : _a.includeComponentSchemas) {
                for (const [schemaName, schemaObject] of Object.entries((_c = (_b = api.components) === null || _b === void 0 ? void 0 : _b.schemas) !== null && _c !== void 0 ? _c : {})) {
                    if (schemaObject['$ref'] === undefined) {
                        this.includeSchema(schemaObject, schemaName, inputModel, options);
                    }
                }
            }
            return inputModel;
        });
    }
    processPath(pathObject, path, inputModel, options) {
        if (pathObject) {
            //Remove all special chars from path
            let formattedPathName = path.replace(/[^\w\s*]+/g, '');
            //Remove any pre-pending '/'
            formattedPathName = formattedPathName.replace(/\//, '');
            //Replace all segment separators '/'
            formattedPathName = formattedPathName.replace(/\//gm, '_');
            this.processOperation(pathObject.get, `${formattedPathName}_get`, inputModel, options);
            this.processOperation(pathObject.put, `${formattedPathName}_put`, inputModel, options);
            this.processOperation(pathObject.post, `${formattedPathName}_post`, inputModel, options);
            this.processOperation(pathObject.delete, `${formattedPathName}_delete`, inputModel, options);
            this.processOperation(pathObject.options, `${formattedPathName}_options`, inputModel, options);
            this.processOperation(pathObject.head, `${formattedPathName}_head`, inputModel, options);
            this.processOperation(pathObject.patch, `${formattedPathName}_patch`, inputModel, options);
            this.processOperation(pathObject.trace, `${formattedPathName}_trace`, inputModel, options);
            this.iterateParameters(pathObject.parameters, `${formattedPathName}_parameters`, inputModel, options);
        }
    }
    processOperation(operation, path, inputModel, options) {
        if (operation && operation.responses) {
            this.iterateResponses(operation.responses, path, inputModel, options);
            this.iterateParameters(operation.parameters, `${path}_parameters`, inputModel, options);
            if (operation.requestBody) {
                this.iterateMediaType(operation.requestBody.content || {}, path, inputModel, options);
            }
            if (operation.callbacks) {
                for (const [callbackName, callback] of Object.entries(operation.callbacks)) {
                    const callbackObject = callback;
                    for (const [callbackPath, callbackPathObject] of Object.entries(callbackObject)) {
                        this.processPath(callbackPathObject, `${path}_callback_${callbackName}_${callbackPath}`, inputModel, options);
                    }
                }
            }
        }
    }
    iterateResponses(responses, path, inputModel, options) {
        for (const [responseName, response] of Object.entries(responses)) {
            //Replace any '/' with '_'
            const formattedResponseName = responseName.replace(/\//, '_');
            this.iterateMediaType(response
                .content || {}, `${path}_${formattedResponseName}`, inputModel, options);
        }
    }
    iterateParameters(parameters, path, inputModel, options) {
        for (const parameterObject of parameters || []) {
            const parameter = parameterObject;
            if (parameter.schema) {
                this.includeSchema(parameter.schema, `${path}_${parameter.in}_${parameter.name}`, inputModel, options);
            }
        }
    }
    iterateMediaType(mediaTypes, path, inputModel, options) {
        for (const [mediaContent, mediaTypeObject] of Object.entries(mediaTypes)) {
            const mediaType = mediaTypeObject;
            if (mediaType.schema === undefined) {
                continue;
            }
            const mediaTypeSchema = mediaType.schema;
            //Replace any '/' with '_'
            const formattedMediaContent = mediaContent.replace(/\//, '_');
            this.includeSchema(mediaTypeSchema, `${path}_${formattedMediaContent}`, inputModel, options);
        }
    }
    includeSchema(schema, name, inputModel, options) {
        const internalSchema = OpenAPIInputProcessor.convertToInternalSchema(schema, name);
        const newMetaModel = JsonSchemaInputProcessor_1.JsonSchemaInputProcessor.convertSchemaToMetaModel(internalSchema, options);
        if (inputModel.models[newMetaModel.name] !== undefined) {
            utils_1.Logger.warn(`Overwriting existing model with name ${newMetaModel.name}, are there two models with the same name present? Overwriting the old model.`, newMetaModel.name);
        }
        inputModel.models[newMetaModel.name] = newMetaModel;
    }
    /**
     * Converts a schema to the internal schema format.
     *
     * @param schema to convert
     * @param name of the schema
     */
    static convertToInternalSchema(schema, name) {
        const namedSchema = JsonSchemaInputProcessor_1.JsonSchemaInputProcessor.reflectSchemaNames(schema, {}, new Set(), name, true);
        return models_1.OpenapiV3Schema.toSchema(namedSchema);
    }
    /**
     * Figures out if an object is of type OpenAPI V3.0.x document and supported
     *
     * @param input
     */
    shouldProcess(input) {
        const version = this.tryGetVersionOfDocument(input);
        if (!version) {
            return false;
        }
        return OpenAPIInputProcessor.supportedVersions.includes(version);
    }
    /**
     * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
     *
     * @param input
     */
    tryGetVersionOfDocument(input) {
        return input && input.openapi;
    }
}
exports.OpenAPIInputProcessor = OpenAPIInputProcessor;
OpenAPIInputProcessor.supportedVersions = ['3.0.0', '3.0.1', '3.0.2', '3.0.3', '3.1.0'];
//# sourceMappingURL=OpenAPIInputProcessor.js.map