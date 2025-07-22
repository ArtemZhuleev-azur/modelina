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
exports.TypeScriptGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const TypeScriptPreset_1 = require("./TypeScriptPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const InterfaceRenderer_1 = require("./renderers/InterfaceRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const TypeRenderer_1 = require("./renderers/TypeRenderer");
const TypeScriptConstrainer_1 = require("./TypeScriptConstrainer");
const utils_1 = require("../../utils");
const TypeScriptDependencyManager_1 = require("./TypeScriptDependencyManager");
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
/**
 * Generator for TypeScript
 */
class TypeScriptGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = TypeScriptGenerator.getOptions(options);
        super('TypeScript', realizedOptions);
    }
    /**
     * Returns the TypeScript options by merging custom options with default ones.
     */
    static getOptions(options) {
        const optionsToUse = (0, utils_1.mergePartialAndDefault)(TypeScriptGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        const dependencyManagerOverwritten = optionsToUse.dependencyManager !==
            TypeScriptGenerator.defaultOptions.dependencyManager;
        if (!dependencyManagerOverwritten) {
            optionsToUse.dependencyManager = () => {
                return new TypeScriptDependencyManager_1.TypeScriptDependencyManager(optionsToUse);
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
        const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, helpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: Object.assign({}, this.options),
            constrainedName: '' //This is just a placeholder, it will be constrained within the function
        }, SAFE_MODEL_TYPES);
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * @param model
     * @param inputModel
     * @param options
     */
    renderCompleteModel(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const completeModelOptionsToUse = (0, utils_1.mergePartialAndDefault)(TypeScriptGenerator.defaultCompleteModelOptions, args.completeOptions);
            const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), args.options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: Object.assign(Object.assign({}, optionsToUse), { dependencyManager: dependencyManagerToUse }) }));
            const modelDependencies = args.constrainedModel.getNearestDependencies();
            //Create the correct model dependency imports
            const modelDependencyImports = modelDependencies.map((model) => {
                return dependencyManagerToUse.renderCompleteModelDependencies(model, completeModelOptionsToUse.exportType);
            });
            const modelExport = dependencyManagerToUse.renderExport(args.constrainedModel, completeModelOptionsToUse.exportType);
            const modelCode = `${outputModel.result}\n${modelExport}`;
            const outputContent = `${[
                ...modelDependencyImports,
                ...outputModel.dependencies
            ].join('\n')}
${modelCode}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    /**
     * Render any ConstrainedMetaModel to code based on the type
     */
    render(args) {
        const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), args.options));
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            if (this.options.modelType === 'interface') {
                return this.renderInterface(args.constrainedModel, args.inputModel, optionsToUse);
            }
            return this.renderClass(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        return this.renderType(args.constrainedModel, args.inputModel, optionsToUse);
    }
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('class');
            const renderer = new ClassRenderer_1.ClassRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
    renderInterface(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('interface');
            const renderer = new InterfaceRenderer_1.InterfaceRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
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
            const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('enum');
            const renderer = new EnumRenderer_1.EnumRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
    renderType(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = TypeScriptGenerator.getOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('type');
            const renderer = new TypeRenderer_1.TypeRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
}
exports.TypeScriptGenerator = TypeScriptGenerator;
TypeScriptGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { renderTypes: true, modelType: 'class', enumType: 'enum', mapType: 'map', defaultPreset: TypeScriptPreset_1.TS_DEFAULT_PRESET, typeMapping: TypeScriptConstrainer_1.TypeScriptDefaultTypeMapping, constraints: TypeScriptConstrainer_1.TypeScriptDefaultConstraints, moduleSystem: 'ESM', rawPropertyNames: false, useJavascriptReservedKeywords: true, 
    // Temporarily set
    dependencyManager: () => {
        return {};
    } });
TypeScriptGenerator.defaultCompleteModelOptions = {
    exportType: 'default'
};
//# sourceMappingURL=TypeScriptGenerator.js.map