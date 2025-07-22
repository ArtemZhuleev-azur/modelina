"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputProcessor = void 0;
const AsyncAPIInputProcessor_1 = require("./AsyncAPIInputProcessor");
const JsonSchemaInputProcessor_1 = require("./JsonSchemaInputProcessor");
const SwaggerInputProcessor_1 = require("./SwaggerInputProcessor");
const OpenAPIInputProcessor_1 = require("./OpenAPIInputProcessor");
const TypeScriptInputProcessor_1 = require("./TypeScriptInputProcessor");
const AvroSchemaInputProcessor_1 = require("./AvroSchemaInputProcessor");
/**
 * Main input processor which figures out the type of input it receives and delegates the processing into separate individual processors.
 */
class InputProcessor {
    constructor() {
        this.processors = new Map();
        this.setProcessor('asyncapi', new AsyncAPIInputProcessor_1.AsyncAPIInputProcessor());
        this.setProcessor('swagger', new SwaggerInputProcessor_1.SwaggerInputProcessor());
        this.setProcessor('openapi', new OpenAPIInputProcessor_1.OpenAPIInputProcessor());
        this.setProcessor('default', new JsonSchemaInputProcessor_1.JsonSchemaInputProcessor());
        this.setProcessor('typescript', new TypeScriptInputProcessor_1.TypeScriptInputProcessor());
        this.setProcessor('avro', new AvroSchemaInputProcessor_1.AvroSchemaInputProcessor());
    }
    /**
     * Set a processor.
     *
     * @param type of processor
     * @param processor
     */
    setProcessor(type, processor) {
        this.processors.set(type, processor);
    }
    /**
     *
     * @returns all processors
     */
    getProcessors() {
        return this.processors;
    }
    /**
     * The processor code which delegates the processing to the correct implementation.
     *
     * @param input to process
     * @param options passed to the processors
     */
    process(input, options) {
        for (const [type, processor] of this.processors) {
            if (type === 'default') {
                continue;
            }
            if (processor.shouldProcess(input)) {
                return processor.process(input, options);
            }
        }
        const defaultProcessor = this.processors.get('default');
        if (defaultProcessor !== undefined) {
            return defaultProcessor.process(input, options);
        }
        return Promise.reject(new Error('No default processor found'));
    }
}
exports.InputProcessor = InputProcessor;
InputProcessor.processor = new InputProcessor();
//# sourceMappingURL=InputProcessor.js.map