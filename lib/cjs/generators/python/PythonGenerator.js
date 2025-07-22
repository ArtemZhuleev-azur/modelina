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
exports.PythonGenerator = void 0;
/* eslint-disable no-console */
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const PythonPreset_1 = require("./PythonPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const __1 = require("../..");
const ConstrainHelpers_1 = require("../../helpers/ConstrainHelpers");
const PythonConstrainer_1 = require("./PythonConstrainer");
const Partials_1 = require("../../utils/Partials");
const PythonDependencyManager_1 = require("./PythonDependencyManager");
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
    models_1.ConstrainedEnumModel
];
class PythonGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = PythonGenerator.getPythonOptions(options);
        super('Python', realizedOptions);
    }
    /**
     * Returns the Python options by merging custom options with default ones.
     */
    static getPythonOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(PythonGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new PythonDependencyManager_1.PythonDependencyManager(optionsToUse);
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
        const optionsToUse = PythonGenerator.getPythonOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, ConstrainHelpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: Object.assign({}, this.options),
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
        const optionsToUse = PythonGenerator.getPythonOptions(Object.assign(Object.assign({}, this.options), args.options));
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            return this.renderClass(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        __1.Logger.warn(`Python generator, cannot generate this type of model, ${args.constrainedModel.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * For Python you need to specify which package the model is placed under.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(args) {
        return __awaiter(this, void 0, void 0, function* () {
            //const completeModelOptionsToUse = mergePartialAndDefault(PythonGenerator.defaultCompleteModelOptions, completeModelOptions) as PythonRenderCompleteModelOptions;
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(PythonGenerator.defaultCompleteModelOptions, args.completeOptions);
            const optionsToUse = PythonGenerator.getPythonOptions(Object.assign(Object.assign({}, this.options), args.options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: Object.assign(Object.assign({}, optionsToUse), { dependencyManager: dependencyManagerToUse }) }));
            const modelDependencies = args.constrainedModel
                .getNearestDependencies()
                .map((model) => {
                return dependencyManagerToUse.renderDependency(model, completeModelOptionsToUse.packageName);
            });
            const outputContent = `${outputModel.dependencies.join('\n')}
${modelDependencies.join('\n')}
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
            const optionsToUse = PythonGenerator.getPythonOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('class');
            const renderer = new ClassRenderer_1.ClassRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.renderDependencies()
            });
        });
    }
    renderEnum(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = PythonGenerator.getPythonOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('enum');
            const renderer = new EnumRenderer_1.EnumRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.renderDependencies()
            });
        });
    }
}
exports.PythonGenerator = PythonGenerator;
PythonGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: PythonPreset_1.PYTHON_DEFAULT_PRESET, typeMapping: PythonConstrainer_1.PythonDefaultTypeMapping, constraints: PythonConstrainer_1.PythonDefaultConstraints, importsStyle: 'explicit', 
    // Temporarily set
    dependencyManager: () => {
        return {};
    } });
PythonGenerator.defaultCompleteModelOptions = {
    packageName: 'asyncapimodels'
};
//# sourceMappingURL=PythonGenerator.js.map