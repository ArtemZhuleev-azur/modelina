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
exports.JavaGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const JavaPreset_1 = require("./JavaPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const Constants_1 = require("./Constants");
const __1 = require("../../");
const JavaConstrainer_1 = require("./JavaConstrainer");
const Partials_1 = require("../../utils/Partials");
const JavaDependencyManager_1 = require("./JavaDependencyManager");
const UnionRenderer_1 = require("./renderers/UnionRenderer");
const RecordRenderer_1 = require("./renderers/RecordRenderer");
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
class JavaGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = JavaGenerator.getJavaOptions(options);
        super('Java', realizedOptions);
    }
    /**
     * Returns the Java options by merging custom options with default ones.
     */
    static getJavaOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(JavaGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new JavaDependencyManager_1.JavaDependencyManager(optionsToUse);
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
        const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, helpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
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
        const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), args.options));
        if (args.constrainedModel instanceof models_1.ConstrainedObjectModel) {
            if (this.options.modelType === 'record') {
                return this.renderRecord(args.constrainedModel, args.inputModel, optionsToUse);
            }
            return this.renderClass(Object.assign(Object.assign({}, args), { constrainedModel: args.constrainedModel, options: optionsToUse }));
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(args.constrainedModel, args.inputModel, optionsToUse);
        }
        else if (args.constrainedModel instanceof models_1.ConstrainedUnionModel &&
            !(0, JavaConstrainer_1.unionIncludesBuiltInTypes)(args.constrainedModel)) {
            return this.renderUnion(args.constrainedModel, args.inputModel, optionsToUse);
        }
        __1.Logger.warn(`Java generator, cannot generate this type of model, ${args.constrainedModel.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * For Java you need to specify which package the model is placed under.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(JavaGenerator.defaultCompleteModelOptions, args.completeOptions);
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), args.options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            this.assertPackageIsValid(completeModelOptionsToUse);
            const outputModel = yield this.render(Object.assign(Object.assign({}, args), { options: optionsToUse }));
            const modelDependencies = dependencyManagerToUse.renderAllModelDependencies(args.constrainedModel, completeModelOptionsToUse.packageName);
            const outputContent = `package ${completeModelOptionsToUse.packageName};
${modelDependencies}
${outputModel.dependencies.join('\n')}
${outputModel.result}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    assertPackageIsValid(options) {
        const reservedWords = options.packageName
            .split('.')
            .filter((subpackage) => (0, Constants_1.isReservedJavaKeyword)(subpackage, true));
        if (reservedWords.length > 0) {
            throw new Error(`You cannot use '${options.packageName}' as a package name, contains reserved keywords: [${reservedWords.join(', ')}]`);
        }
    }
    renderClass(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), args.options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('class');
            const renderer = new ClassRenderer_1.ClassRenderer(optionsToUse, this, presets, args.constrainedModel, args.inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: args.constrainedModel.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
    renderEnum(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
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
    renderUnion(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
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
    renderRecord(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
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
exports.JavaGenerator = JavaGenerator;
JavaGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: JavaPreset_1.JAVA_DEFAULT_PRESET, collectionType: 'Array', typeMapping: JavaConstrainer_1.JavaDefaultTypeMapping, constraints: JavaConstrainer_1.JavaDefaultConstraints, modelType: 'class', useModelNameAsConstForDiscriminatorProperty: false, useOptionalForNullableProperties: false });
JavaGenerator.defaultCompleteModelOptions = {
    packageName: 'Asyncapi.Models'
};
//# sourceMappingURL=JavaGenerator.js.map