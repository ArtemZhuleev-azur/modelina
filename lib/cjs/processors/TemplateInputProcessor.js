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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateInputProcessor = void 0;
const AbstractInputProcessor_1 = require("./AbstractInputProcessor");
const models_1 = require("../models");
/**
 * Class for processing X input
 */
class TemplateInputProcessor extends AbstractInputProcessor_1.AbstractInputProcessor {
    shouldProcess(input) {
        if (!input) {
            return false;
        }
        return false;
    }
    process(input, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.shouldProcess(input)) {
                throw new Error('Input is not X and cannot be processed by this input processor.');
            }
            const inputModel = new models_1.InputMetaModel();
            // Add processing code here
            return inputModel;
        });
    }
}
exports.TemplateInputProcessor = TemplateInputProcessor;
//# sourceMappingURL=TemplateInputProcessor.js.map