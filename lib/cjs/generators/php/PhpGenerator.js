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
exports.PhpGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const PhpPreset_1 = require("./PhpPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const Constants_1 = require("./Constants");
const __1 = require("../..");
const ConstrainHelpers_1 = require("../../helpers/ConstrainHelpers");
const PhpConstrainer_1 = require("./PhpConstrainer");
const Partials_1 = require("../../utils/Partials");
const PhpDependencyManager_1 = require("./PhpDependencyManager");
/**
 * All the constrained models that do not depend on others to determine the type
 */
const SAFE_MODEL_TYPES = [
    models_1.ConstrainedAnyModel,
    models_1.ConstrainedBooleanModel,
    models_1.ConstrainedFloatModel,
    models_1.ConstrainedIntegerModel,
    models_1.ConstrainedStringModel,
    models_1.ConstrainedReferenceModel,
    models_1.ConstrainedObjectModel,
    models_1.ConstrainedUnionModel,
    models_1.ConstrainedEnumModel,
    models_1.ConstrainedTupleModel,
    models_1.ConstrainedArrayModel,
    models_1.ConstrainedDictionaryModel
];
class PhpGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = PhpGenerator.getPhpOptions(options);
        super('PHP', realizedOptions);
    }
    /**
     * Returns the Php options by merging custom options with default ones.
     */
    static getPhpOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(PhpGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new PhpDependencyManager_1.PhpDependencyManager(optionsToUse);
            };
        }
        return optionsToUse;
    }
    /**
     * Wrapper to get an instance of the dependency manager
     */
    getDependencyManager(options) {
        return this.getDependencyManagerInstance(options);
    }
    /**
     * This function makes sure we split up the MetaModels accordingly to what we want to render as models.
     */
    splitMetaModel(model) {
        //These are the models that we have separate renderers for
        const metaModelsToSplit = {
            splitEnum: true,
            splitObject: true
        };
        return (0, helpers_1.split)(model, metaModelsToSplit);
    }
    constrainToMetaModel(model, options) {
        const optionsToUse = PhpGenerator.getPhpOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, ConstrainHelpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: this.options,
            constrainedName: '' //This is just a placeholder, it will be constrained within the function
        }, SAFE_MODEL_TYPES);
    }
    /**
     * Render a scattered model, where the source code and library and model dependencies are separated.
     *
     * @param model
     * @param inputModel
     */
    render(args) {
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            return this.renderClass(args.constrainedModel, args.inputModel);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel);
        }
        __1.Logger.warn(`PHP generator, cannot generate this type of model, ${args.constrainedModel.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(PhpGenerator.defaultCompleteModelOptions, args.completeOptions);
            if ((0, Constants_1.isReservedPhpKeyword)(completeModelOptionsToUse.namespace)) {
                throw new Error(`You cannot use reserved PHP keyword (${completeModelOptionsToUse.namespace}) as package name, please use another.`);
            }
            const declares = completeModelOptionsToUse.declareStrictTypes
                ? 'declare(strict_types=1);'
                : '';
            const outputModel = yield this.render(args);
            const modelDependencies = args.constrainedModel
                .getNearestDependencies()
                .map((dependencyModel) => {
                return `use ${completeModelOptionsToUse.namespace}\\${dependencyModel.name};`;
            });
            const outputContent = `<?php
${declares}

namespace ${completeModelOptionsToUse.namespace};

${modelDependencies.join('\n')}
${outputModel.dependencies.join('\n')}
${outputModel.result}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = PhpGenerator.getPhpOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('class');
            const renderer = new ClassRenderer_1.ClassRenderer(this.options, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
    renderEnum(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = PhpGenerator.getPhpOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('enum');
            const renderer = new EnumRenderer_1.EnumRenderer(this.options, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
}
exports.PhpGenerator = PhpGenerator;
PhpGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: PhpPreset_1.PHP_DEFAULT_PRESET, typeMapping: PhpConstrainer_1.PhpDefaultTypeMapping, constraints: PhpConstrainer_1.PhpDefaultConstraints });
PhpGenerator.defaultCompleteModelOptions = {
    namespace: 'Asyncapi',
    declareStrictTypes: true
};
//# sourceMappingURL=PhpGenerator.js.map