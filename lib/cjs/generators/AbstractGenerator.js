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
exports.AbstractGenerator = exports.defaultGeneratorOptions = void 0;
const models_1 = require("../models");
const processors_1 = require("../processors");
const helpers_1 = require("../helpers");
const utils_1 = require("../utils");
exports.defaultGeneratorOptions = {
    indentation: {
        type: helpers_1.IndentationTypes.SPACES,
        size: 2
    }
};
/**
 * Abstract generator which must be implemented by each language
 */
class AbstractGenerator {
    constructor(languageName, options) {
        this.languageName = languageName;
        this.options = options;
    }
    process(input) {
        return processors_1.InputProcessor.processor.process(input, this.options.processorOptions);
    }
    /**
     * This function returns an instance of the dependency manager which is either a factory or an instance.
     */
    getDependencyManagerInstance(options) {
        if (options.dependencyManager === undefined) {
            throw new Error('Internal error, could not find dependency manager instance');
        }
        if (typeof options.dependencyManager === 'function') {
            return options.dependencyManager();
        }
        return options.dependencyManager;
    }
    setImplementedByForModels(constrainedModels, constrainedModel) {
        if (!constrainedModel.options.extend) {
            return;
        }
        for (const extend of constrainedModel.options.extend) {
            const extendModel = constrainedModels.find((m) => m.constrainedModel.name === extend.name);
            if (!extendModel) {
                throw new Error(`Could not find the model ${extend.name} to extend in the constrained models`);
            }
            if (!extendModel.constrainedModel.options.implementedBy) {
                extendModel.constrainedModel.options.implementedBy = [];
            }
            extendModel.constrainedModel.options.implementedBy.push(constrainedModel);
        }
    }
    setParentsForModels(unionConstrainedModelsWithDepManager, constrainedModel) {
        for (const unionConstrainedModel of unionConstrainedModelsWithDepManager) {
            if (unionConstrainedModel.constrainedModel instanceof
                models_1.ConstrainedUnionModel &&
                unionConstrainedModel.constrainedModel.union.some((m) => m.name === constrainedModel.name && m.type === constrainedModel.type)) {
                if (!constrainedModel.options.parents) {
                    constrainedModel.options.parents = [];
                }
                constrainedModel.options.parents.push(unionConstrainedModel.constrainedModel);
            }
        }
    }
    /**
     * Generates an array of ConstrainedMetaModel with its dependency manager from an InputMetaModel.
     * It also adds parents to the ConstrainedMetaModel's which can be used in renderers which needs to know what parents they belong to.
     */
    getConstrainedModels(inputModel) {
        const getConstrainedMetaModelWithDepManager = (model) => {
            const dependencyManager = this.getDependencyManager(this.options);
            const constrainedModel = this.constrainToMetaModel(model, {
                dependencyManager
            });
            return {
                constrainedModel,
                dependencyManager
            };
        };
        const unionConstrainedModelsWithDepManager = [];
        const constrainedModelsWithDepManager = [];
        for (const model of Object.values(inputModel.models)) {
            if (model instanceof models_1.UnionModel) {
                unionConstrainedModelsWithDepManager.push(getConstrainedMetaModelWithDepManager(model));
                continue;
            }
            constrainedModelsWithDepManager.push(getConstrainedMetaModelWithDepManager(model));
        }
        const constrainedModels = [
            ...unionConstrainedModelsWithDepManager,
            ...constrainedModelsWithDepManager
        ];
        for (const { constrainedModel } of constrainedModels) {
            this.setImplementedByForModels(constrainedModels, constrainedModel);
            this.setParentsForModels(unionConstrainedModelsWithDepManager, constrainedModel);
        }
        return constrainedModels;
    }
    /**
     * Generates the full output of a model, instead of a scattered model.
     *
     * OutputModels result is no longer the model itself, but including package, package dependencies and model dependencies.
     *
     */
    generateCompleteModels(input, completeOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputModel = yield this.processInput(input);
            return Promise.all(this.getConstrainedModels(inputModel).map(({ constrainedModel, dependencyManager }) => __awaiter(this, void 0, void 0, function* () {
                const renderedOutput = yield this.renderCompleteModel({
                    constrainedModel,
                    inputModel,
                    completeOptions,
                    options: { dependencyManager }
                });
                return models_1.OutputModel.toOutputModel({
                    result: renderedOutput.result,
                    modelName: renderedOutput.renderedName,
                    dependencies: renderedOutput.dependencies,
                    model: constrainedModel,
                    inputModel
                });
            })));
        });
    }
    /**
     * Generates a scattered model where dependencies and rendered results are separated.
     */
    generate(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputModel = yield this.processInput(input);
            return Promise.all(this.getConstrainedModels(inputModel).map(({ constrainedModel, dependencyManager }) => __awaiter(this, void 0, void 0, function* () {
                const renderedOutput = yield this.render({
                    constrainedModel,
                    inputModel,
                    options: {
                        dependencyManager
                    }
                });
                return models_1.OutputModel.toOutputModel({
                    result: renderedOutput.result,
                    modelName: renderedOutput.renderedName,
                    dependencies: renderedOutput.dependencies,
                    model: constrainedModel,
                    inputModel
                });
            })));
        });
    }
    /**
     * Process any of the input formats to the appropriate InputMetaModel type and split out the meta models
     * based on the requirements of the generators
     *
     * @param input
     */
    processInput(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawInputModel = input instanceof models_1.InputMetaModel ? input : yield this.process(input);
            //Split out the models based on the language specific requirements of which models is rendered separately
            const splitOutModels = {};
            for (const model of Object.values(rawInputModel.models)) {
                const splitModels = this.splitMetaModel(model);
                for (const splitModel of splitModels) {
                    splitOutModels[splitModel.name] = splitModel;
                }
            }
            rawInputModel.models = splitOutModels;
            return rawInputModel;
        });
    }
    /**
     * Get all presets (default and custom ones from options) for a given preset type (class, enum, etc).
     */
    getPresets(presetType) {
        const filteredPresets = [];
        const defaultPreset = this.options.defaultPreset;
        if (defaultPreset !== undefined) {
            filteredPresets.push([defaultPreset[String(presetType)], this.options]);
        }
        const presets = this.options.presets || [];
        for (const p of presets) {
            if ((0, utils_1.isPresetWithOptions)(p)) {
                const preset = p.preset[String(presetType)];
                if (preset) {
                    filteredPresets.push([preset, p.options]);
                }
            }
            else {
                const preset = p[String(presetType)];
                if (preset) {
                    filteredPresets.push([preset, undefined]);
                }
            }
        }
        return filteredPresets;
    }
}
exports.AbstractGenerator = AbstractGenerator;
//# sourceMappingURL=AbstractGenerator.js.map