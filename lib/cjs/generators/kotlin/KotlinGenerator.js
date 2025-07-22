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
exports.KotlinGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const KotlinPreset_1 = require("./KotlinPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const Constants_1 = require("./Constants");
const __1 = require("../..");
const ConstrainHelpers_1 = require("../../helpers/ConstrainHelpers");
const KotlinConstrainer_1 = require("./KotlinConstrainer");
const Partials_1 = require("../../utils/Partials");
const KotlinDependencyManager_1 = require("./KotlinDependencyManager");
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
    models_1.ConstrainedEnumModel,
    models_1.ConstrainedUnionModel
];
class KotlinGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = KotlinGenerator.getKotlinOptions(options);
        super('Kotlin', realizedOptions);
    }
    /**
     * Returns the Kotlin options by merging custom options with default ones.
     */
    static getKotlinOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(KotlinGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new KotlinDependencyManager_1.KotlinDependencyManager(optionsToUse);
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
        const metaModelsToSplit = {
            splitEnum: true,
            splitObject: true
        };
        return (0, helpers_1.split)(model, metaModelsToSplit);
    }
    constrainToMetaModel(model, options) {
        const optionsToUse = KotlinGenerator.getKotlinOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, ConstrainHelpers_1.constrainMetaModel)(optionsToUse.typeMapping, optionsToUse.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: optionsToUse,
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
        const optionsToUse = KotlinGenerator.getKotlinOptions(Object.assign(Object.assign({}, this.options), args.options));
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            return this.renderClass(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        __1.Logger.warn(`Kotlin generator, cannot generate this type of model, ${args.constrainedModel.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * For Kotlin you need to specify which package the model is placed under.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = KotlinGenerator.getKotlinOptions(Object.assign(Object.assign({}, this.options), args.options));
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: optionsToUse }));
            const packageName = this.sanitizePackageName((_a = args.completeOptions.packageName) !== null && _a !== void 0 ? _a : 'Asyncapi.Models');
            const outputContent = `package ${packageName}
${outputModel.dependencies.join('\n')}

${outputModel.result}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    sanitizePackageName(packageName) {
        return packageName
            .split('.')
            .map((subpackage) => (0, Constants_1.isReservedKotlinKeyword)(subpackage, true)
            ? `\`${subpackage}\``
            : subpackage)
            .join('.');
    }
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = KotlinGenerator.getKotlinOptions(Object.assign(Object.assign({}, this.options), options));
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
            const optionsToUse = KotlinGenerator.getKotlinOptions(Object.assign(Object.assign({}, this.options), options));
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
exports.KotlinGenerator = KotlinGenerator;
KotlinGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { indentation: {
        type: helpers_1.IndentationTypes.SPACES,
        size: 4
    }, defaultPreset: KotlinPreset_1.KOTLIN_DEFAULT_PRESET, collectionType: 'List', typeMapping: KotlinConstrainer_1.KotlinDefaultTypeMapping, constraints: KotlinConstrainer_1.KotlinDefaultConstraints });
//# sourceMappingURL=KotlinGenerator.js.map