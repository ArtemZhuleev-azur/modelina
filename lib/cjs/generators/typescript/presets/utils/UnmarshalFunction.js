"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderUnmarshal = void 0;
const helpers_1 = require("../../../../helpers");
const models_1 = require("../../../../models");
/**
 * Render the unmarshalled value
 */
function renderUnmarshalProperty(modelInstanceVariable, model) {
    if (model instanceof models_1.ConstrainedReferenceModel &&
        !(model.ref instanceof models_1.ConstrainedEnumModel)) {
        return `${model.type}.unmarshal(${modelInstanceVariable})`;
    }
    if (model instanceof models_1.ConstrainedArrayModel &&
        model.valueModel instanceof models_1.ConstrainedReferenceModel &&
        !(model.valueModel.ref instanceof models_1.ConstrainedEnumModel) &&
        !(model.valueModel instanceof models_1.ConstrainedUnionModel)) {
        return `${modelInstanceVariable} == null
    ? null
    : ${modelInstanceVariable}.map((item: any) => ${model.valueModel.type}.unmarshal(item))`;
    }
    return `${modelInstanceVariable}`;
}
/**
 * Render the code for unmarshalling of regular properties
 */
function unmarshalRegularProperty(propModel) {
    if (propModel.property.options.const) {
        return undefined;
    }
    const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
    const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property);
    return `if (${modelInstanceVariable} !== undefined) {
  instance.${propModel.propertyName} = ${unmarshalCode};
}`;
}
/**
 * Render the code for unmarshalling unwrappable dictionary models
 */
function unmarshalDictionary(model) {
    const setDictionaryProperties = [];
    const unmarshalDictionaryProperties = [];
    const properties = model.properties || {};
    const propertyKeys = [...Object.entries(properties)];
    const originalPropertyNames = propertyKeys.map(([, model]) => {
        return model.unconstrainedPropertyName;
    });
    const unwrapDictionaryProperties = (0, helpers_1.getDictionary)(properties);
    for (const [prop, propModel] of unwrapDictionaryProperties) {
        const modelInstanceVariable = 'value as any';
        const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property.value);
        setDictionaryProperties.push(`instance.${prop} = new Map();`);
        unmarshalDictionaryProperties.push(`instance.${prop}.set(key, ${unmarshalCode});`);
    }
    const corePropertyKeys = originalPropertyNames
        .map((propertyKey) => `"${propertyKey}"`)
        .join(',');
    if (setDictionaryProperties.length > 0) {
        return `${setDictionaryProperties.join('\n')}
const propsToCheck = Object.entries(obj).filter((([key,]) => {return ![${corePropertyKeys}].includes(key);}));
for (const [key, value] of propsToCheck) {
  ${unmarshalDictionaryProperties.join('\n')}
}`;
    }
    return '';
}
/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }) {
    const properties = model.properties || {};
    const normalProperties = (0, helpers_1.getNormalProperties)(properties);
    const unmarshalNormalProperties = normalProperties.map(([, propModel]) => unmarshalRegularProperty(propModel));
    const unwrappedDictionaryCode = unmarshalDictionary(model);
    return `public static unmarshal(json: string | object): ${model.type} {
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${model.type}({} as any);

${renderer.indent(unmarshalNormalProperties.join('\n'))}
  
${renderer.indent(unwrappedDictionaryCode)}
  return instance;
}`;
}
exports.renderUnmarshal = renderUnmarshal;
//# sourceMappingURL=UnmarshalFunction.js.map