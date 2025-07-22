"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvroSchemaInputProcessor = void 0;
const AbstractInputProcessor_1 = require("./AbstractInputProcessor");
const models_1 = require("../models");
const utils_1 = require("../utils");
const AvroToMetaModel_1 = require("../helpers/AvroToMetaModel");
/**
 * Class for processing Avro Schema input
 */
const avroType = [
    'null',
    'boolean',
    'int',
    'long',
    'double',
    'float',
    'string',
    'record',
    'enum',
    'array',
    'map'
];
class AvroSchemaInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    /**
     * Function processing an Avro Schema input
     *
     * @param input
     */
    shouldProcess(input) {
        if (input === '' ||
            JSON.stringify(input) === '{}' ||
            JSON.stringify(input) === '[]') {
            return false;
        }
        if (!avroType.includes(input.type) || !input.name) {
            return false;
        }
        return true;
    }
    process(input) {
        if (!this.shouldProcess(input)) {
            return Promise.reject(new Error('Input is not an Avro Schema, so it cannot be processed.'));
        }
        utils_1.Logger.debug('Processing input as Avro Schema document');
        const inputModel = new models_1.InputMetaModel();
        inputModel.originalInput = input;
        const metaModel = (0, AvroToMetaModel_1.AvroToMetaModel)(input);
        inputModel.models[metaModel.name] = metaModel;
        utils_1.Logger.debug('Completed processing input as Avro Schema document');
        return Promise.resolve(inputModel);
    }
}
exports.AvroSchemaInputProcessor = AvroSchemaInputProcessor;
//# sourceMappingURL=AvroSchemaInputProcessor.js.map