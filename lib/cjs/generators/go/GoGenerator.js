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
exports.GoGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const GoPreset_1 = require("./GoPreset");
const StructRenderer_1 = require("./renderers/StructRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const LoggingInterface_1 = require("../../utils/LoggingInterface");
const GoConstrainer_1 = require("./GoConstrainer");
const Partials_1 = require("../../utils/Partials");
const GoDependencyManager_1 = require("./GoDependencyManager");
const UnionRenderer_1 = require("./renderers/UnionRenderer");
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
    models_1.ConstrainedTupleModel,
    models_1.ConstrainedEnumModel
];
/**
 * Generator for Go
 */
class GoGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = GoGenerator.getGoOptions(options);
        super('Go', realizedOptions);
    }
    /**
     * Returns the Go options by merging custom options with default ones.
     */
    static getGoOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(GoGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new GoDependencyManager_1.GoDependencyManager(optionsToUse);
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
            splitObject: true,
            splitUnion: true
        };
        return (0, helpers_1.split)(model, metaModelsToSplit);
    }
    constrainToMetaModel(model, options) {
        const optionsToUse = GoGenerator.getGoOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, helpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: this.options,
            constrainedName: '' //This is just a placeholder, it will be constrained within the function
        }, SAFE_MODEL_TYPES);
    }
    render(args) {
        const optionsToUse = GoGenerator.getGoOptions(Object.assign(Object.assign({}, this.options), args.options));
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            return this.renderStruct(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedUnionModel) {
            return this.renderUnion(args.constrainedModel, args.inputModel, optionsToUse);
        }
        LoggingInterface_1.Logger.warn(`Go generator, cannot generate this type of model, ${args.constrainedModel.name}`);
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
     * @param options
     */
    renderCompleteModel(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(GoGenerator.defaultCompleteModelOptions, args.completeOptions);
            const optionsToUse = GoGenerator.getGoOptions(Object.assign(Object.assign({}, this.options), args.options));
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: optionsToUse }));
            let importCode = '';
            if (outputModel.dependencies.length > 0) {
                const dependencies = outputModel.dependencies
                    .map((dependency) => {
                    return `"${dependency}"`;
                })
                    .join('\n');
                importCode = `import (  
  ${dependencies}
)`;
            }
            const outputContent = `
package ${completeModelOptionsToUse.packageName}
${importCode}
${outputModel.result}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    renderEnum(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = GoGenerator.getGoOptions(Object.assign(Object.assign({}, this.options), options));
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
    renderStruct(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = GoGenerator.getGoOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('struct');
            const renderer = new StructRenderer_1.StructRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
    renderUnion(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = GoGenerator.getGoOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('union');
            const renderer = new UnionRenderer_1.UnionRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
}
exports.GoGenerator = GoGenerator;
GoGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: GoPreset_1.GO_DEFAULT_PRESET, typeMapping: GoConstrainer_1.GoDefaultTypeMapping, constraints: GoConstrainer_1.GoDefaultConstraints, unionAnyModelName: 'ModelinaAnyType', unionDictModelName: 'ModelinaDictType', unionArrModelName: 'ModelinaArrType' });
GoGenerator.defaultCompleteModelOptions = {
    packageName: 'AsyncapiModels'
};
//# sourceMappingURL=GoGenerator.js.map