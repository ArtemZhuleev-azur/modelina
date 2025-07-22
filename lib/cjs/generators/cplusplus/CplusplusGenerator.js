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
exports.CplusplusGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const CplusplusPreset_1 = require("./CplusplusPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const Constants_1 = require("./Constants");
const __1 = require("../..");
const ConstrainHelpers_1 = require("../../helpers/ConstrainHelpers");
const CplusplusConstrainer_1 = require("./CplusplusConstrainer");
const Partials_1 = require("../../utils/Partials");
const CplusplusDependencyManager_1 = require("./CplusplusDependencyManager");
/**
 * All the constrained models that do not depend on others to determine the type
 */
const SAFE_MODEL_TYPES = [
    models_1.ConstrainedObjectModel,
    models_1.ConstrainedReferenceModel,
    models_1.ConstrainedAnyModel,
    models_1.ConstrainedFloatModel,
    models_1.ConstrainedIntegerModel,
    models_1.ConstrainedStringModel,
    models_1.ConstrainedBooleanModel,
    models_1.ConstrainedEnumModel
];
class CplusplusGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = CplusplusGenerator.getOptions(options);
        super('Cplusplus', realizedOptions);
    }
    /**
     * Returns the Cplusplus options by merging custom options with default ones.
     */
    static getOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(CplusplusGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new CplusplusDependencyManager_1.CplusplusDependencyManager(optionsToUse);
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
        const optionsToUse = CplusplusGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
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
        const optionsToUse = CplusplusGenerator.getOptions(Object.assign(Object.assign({}, this.options), args.options));
        if ((0, Constants_1.isReservedCplusplusKeyword)(optionsToUse.namespace)) {
            throw new Error(`You cannot use reserved C++ keyword (${optionsToUse.namespace}) as namespace, please use another.`);
        }
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            return this.renderClass(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        __1.Logger.warn(`C++ generator, cannot generate this type of model, ${args.constrainedModel.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * For Cplusplus you need to specify which package the model is placed under.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(CplusplusGenerator.defaultCompleteModelOptions, args.completeOptions);
            const optionsToUse = CplusplusGenerator.getOptions(Object.assign(Object.assign({}, this.options), args.options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: Object.assign(Object.assign({}, optionsToUse), { dependencyManager: dependencyManagerToUse }) }));
            const imports = args.constrainedModel
                .getNearestDependencies()
                .map((model) => {
                return `#include "${model.name}.hpp"`;
            });
            const formattedOutputResult = helpers_1.FormatHelpers.indent(outputModel.result, 2, (_a = optionsToUse.indentation) === null || _a === void 0 ? void 0 : _a.type);
            const outputContent = `${outputModel.dependencies.join('\n')}
${imports.join('\n')}
namespace ${optionsToUse.namespace}{
${formattedOutputResult}
}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = CplusplusGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
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
            const optionsToUse = CplusplusGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
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
exports.CplusplusGenerator = CplusplusGenerator;
CplusplusGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: CplusplusPreset_1.CPLUSPLUS_DEFAULT_PRESET, typeMapping: CplusplusConstrainer_1.CplusplusDefaultTypeMapping, constraints: CplusplusConstrainer_1.CplusplusDefaultConstraints, namespace: 'AsyncapiModels' });
CplusplusGenerator.defaultCompleteModelOptions = {};
//# sourceMappingURL=CplusplusGenerator.js.map