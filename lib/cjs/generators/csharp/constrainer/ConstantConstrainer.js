"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConstantConstraints = void 0;
const models_1 = require("../../../models");
const getConstrainedEnumModelConstant = (args) => {
    const constrainedEnumValueModel = args.constrainedEnumModel.values.find((value) => value.originalInput === args.constOptions.originalInput);
    if (constrainedEnumValueModel) {
        return `${args.constrainedMetaModel.type}.${constrainedEnumValueModel.key}`;
    }
};
function defaultConstantConstraints() {
    return ({ constrainedMetaModel }) => {
        const constOptions = constrainedMetaModel.options.const;
        if (!constOptions) {
            return undefined;
        }
        if (constrainedMetaModel instanceof models_1.ConstrainedReferenceModel &&
            constrainedMetaModel.ref instanceof models_1.ConstrainedEnumModel) {
            return getConstrainedEnumModelConstant({
                constrainedMetaModel,
                constrainedEnumModel: constrainedMetaModel.ref,
                constOptions
            });
        }
        else if (constrainedMetaModel instanceof models_1.ConstrainedEnumModel) {
            return getConstrainedEnumModelConstant({
                constrainedMetaModel,
                constrainedEnumModel: constrainedMetaModel,
                constOptions
            });
        }
        else if (constrainedMetaModel instanceof models_1.ConstrainedStringModel) {
            return `"${constOptions.originalInput}"`;
        }
        return undefined;
    };
}
exports.defaultConstantConstraints = defaultConstantConstraints;
//# sourceMappingURL=ConstantConstrainer.js.map