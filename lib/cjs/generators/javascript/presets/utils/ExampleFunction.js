"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderValueFromModel = void 0;
const models_1 = require("../../../../models");
/**
 * Render specific example values
 * @param model
 */
function renderValueFromModel(model) {
    if (model instanceof models_1.ConstrainedReferenceModel) {
        return `${model.ref.type}.example()`;
    }
    else if (model instanceof models_1.ConstrainedUnionModel) {
        //Greedy example, where we just use the first type of the union models
        return renderValueFromModel(model.union[0]);
    }
    else if (model instanceof models_1.ConstrainedStringModel) {
        return '"string"';
    }
    else if (model instanceof models_1.ConstrainedFloatModel ||
        model instanceof models_1.ConstrainedIntegerModel) {
        return '0';
    }
    else if (model instanceof models_1.ConstrainedBooleanModel) {
        return 'true';
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        const value = renderValueFromModel(model.valueModel);
        return `[${value}]`;
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        const values = model.tuple.map((tupleModel) => renderValueFromModel(tupleModel.value));
        return `[${values.join(', ')}]`;
    }
    return undefined;
}
exports.renderValueFromModel = renderValueFromModel;
function renderExampleFunction({ model }) {
    const properties = model.properties || {};
    const setProperties = [];
    for (const [propertyName, property] of Object.entries(properties)) {
        const potentialRenderedValue = renderValueFromModel(property.property);
        if (potentialRenderedValue === undefined) {
            continue;
        }
        setProperties.push(`  instance.${propertyName} = ${potentialRenderedValue};`);
    }
    return `example(){
  const instance = new ${model.name}({});
${setProperties.join('\n')}
  return instance;
}`;
}
exports.default = renderExampleFunction;
//# sourceMappingURL=ExampleFunction.js.map