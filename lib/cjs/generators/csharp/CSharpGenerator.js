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
exports.CSharpGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const CSharpPreset_1 = require("./CSharpPreset");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const RecordRenderer_1 = require("./renderers/RecordRenderer");
const Constants_1 = require("./Constants");
const index_1 = require("../../index");
const CSharpConstrainer_1 = require("./CSharpConstrainer");
const Partials_1 = require("../../utils/Partials");
const CSharpDependencyManager_1 = require("./CSharpDependencyManager");
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
    models_1.ConstrainedEnumModel,
    models_1.ConstrainedUnionModel
];
/**
 * Generator for CSharp
 */
class CSharpGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = CSharpGenerator.getCSharpOptions(options);
        super('CSharp', realizedOptions);
    }
    /**
     * Returns the CSharp options by merging custom options with default ones.
     */
    static getCSharpOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(this.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new CSharpDependencyManager_1.CSharpDependencyManager(optionsToUse);
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
    splitMetaModel(model) {
        //These are the models that we have separate renderers for
        const metaModelsToSplit = {
            splitEnum: true,
            splitObject: true
        };
        return (0, helpers_1.split)(model, metaModelsToSplit);
    }
    constrainToMetaModel(model, options) {
        const optionsToUse = CSharpGenerator.getCSharpOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, helpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: this.options,
            constrainedName: '' //This is just a placeholder, it will be constrained within the function,
        }, SAFE_MODEL_TYPES);
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * For CSharp we need to specify which namespace the model is placed under.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(args) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(CSharpGenerator.defaultCompleteModelOptions, args.completeOptions);
            const optionsToUse = CSharpGenerator.getCSharpOptions(Object.assign(Object.assign({}, this.options), args.options));
            if ((0, Constants_1.isReservedCSharpKeyword)(completeModelOptionsToUse.namespace)) {
                throw new Error(`You cannot use reserved CSharp keyword (${completeModelOptionsToUse.namespace}) as namespace, please use another.`);
            }
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: optionsToUse }));
            const outputDependencies = outputModel.dependencies.length === 0
                ? ''
                : `${outputModel.dependencies.join('\n')}\n\n`;
            const outputContent = `${outputDependencies}
namespace ${completeModelOptionsToUse.namespace}
{
${helpers_1.FormatHelpers.indent(outputModel.result, (_a = optionsToUse.indentation) === null || _a === void 0 ? void 0 : _a.size, (_b = optionsToUse.indentation) === null || _b === void 0 ? void 0 : _b.type)}
}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    render(args) {
        const optionsToUse = CSharpGenerator.getCSharpOptions(Object.assign(Object.assign({}, this.options), args.options));
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            if (this.options.modelType === 'record') {
                return this.renderRecord(args.constrainedModel, args.inputModel, optionsToUse);
            }
            return this.renderClass(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        index_1.Logger.warn(`C# generator, cannot generate this type of model, ${args.constrainedModel.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    renderEnum(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = CSharpGenerator.getCSharpOptions(Object.assign(Object.assign({}, this.options), options));
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
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = CSharpGenerator.getCSharpOptions(Object.assign(Object.assign({}, this.options), options));
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
    renderRecord(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = CSharpGenerator.getCSharpOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('record');
            const renderer = new RecordRenderer_1.RecordRenderer(this.options, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
}
exports.CSharpGenerator = CSharpGenerator;
CSharpGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { collectionType: 'Array', defaultPreset: CSharpPreset_1.CSHARP_DEFAULT_PRESET, typeMapping: CSharpConstrainer_1.CSharpDefaultTypeMapping, constraints: CSharpConstrainer_1.CSharpDefaultConstraints, autoImplementedProperties: false, handleNullable: false, modelType: 'class', enforceRequired: false, 
    // Temporarily set
    dependencyManager: () => {
        return {};
    } });
CSharpGenerator.defaultCompleteModelOptions = {
    namespace: 'Asyncapi.Models'
};
//# sourceMappingURL=CSharpGenerator.js.map