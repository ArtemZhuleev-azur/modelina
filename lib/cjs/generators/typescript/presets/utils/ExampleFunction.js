"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderValueFromModel = void 0;
const models_1 = require("../../../../models");
/**
 * Inferring first acceptable value from the model.
 *
 * @param model
 */
function renderValueFromModel(model) {
    if (model instanceof models_1.ConstrainedEnumModel && model.values.length > 0) {
        //Greedy example
        return model.values[0].value;
    }
    else if (model instanceof models_1.ConstrainedReferenceModel) {
        return `${model.name}.example()`;
    }
    else if (model instanceof models_1.ConstrainedUnionModel && model.union.length > 0) {
        //Greedy example
        return renderValueFromModel(model.union[0]);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        const arrayType = renderValueFromModel(model.valueModel);
        return `[${arrayType}]`;
    }
    else if (model instanceof models_1.ConstrainedTupleModel && model.tuple.length > 0) {
        const values = model.tuple.map((tupleModel) => {
            return renderValueFromModel(tupleModel.value);
        });
        return `[${values.join(',')}]`;
    }
    else if (model instanceof models_1.ConstrainedStringModel) {
        return '"string"';
    }
    else if (model instanceof models_1.ConstrainedIntegerModel) {
        return '0';
    }
    else if (model instanceof models_1.ConstrainedFloatModel) {
        return '0.0';
    }
    else if (model instanceof models_1.ConstrainedBooleanModel) {
        return 'true';
    }
    return undefined;
}
exports.renderValueFromModel = renderValueFromModel;
/**
 * Render `example` function based on model properties.
 */
function renderExampleFunction({ model }) {
    const properties = model.properties || {};
    const setProperties = [];
    for (const [propertyName, property] of Object.entries(properties)) {
        const potentialRenderedValue = renderValueFromModel(property.property);
        if (potentialRenderedValue === undefined) {
            //Unable to determine example value, skip property.
            continue;
        }
        setProperties.push(`  instance.${propertyName} = ${potentialRenderedValue};`);
    }
    return `public static example(): ${model.type} {
  const instance = new ${model.type}({} as any);
${setProperties.join('\n')}
  return instance;
}`;
}
exports.default = renderExampleFunction;
//# sourceMappingURL=ExampleFunction.js.map