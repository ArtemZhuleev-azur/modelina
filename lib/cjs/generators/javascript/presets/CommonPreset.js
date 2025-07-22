"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JS_COMMON_PRESET = void 0;
const models_1 = require("../../../models");
const ExampleFunction_1 = __importDefault(require("./utils/ExampleFunction"));
function realizePropertyFactory(prop) {
    return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}
function renderMarshalProperty(modelInstanceVariable, model) {
    if (model instanceof models_1.ConstrainedReferenceModel &&
        !(model.ref instanceof models_1.ConstrainedEnumModel)) {
        //Referenced enums only need standard marshalling, so lets filter those away
        return `$\{${modelInstanceVariable}.marshal()}`;
    }
    return realizePropertyFactory(modelInstanceVariable);
}
function renderMarshalProperties(model) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.entries(properties)];
    const marshalProperties = propertyKeys.map(([prop, propModel]) => {
        const modelInstanceVariable = `this.${prop}`;
        const propMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property);
        const marshalCode = `json += \`"${propModel.unconstrainedPropertyName}": ${propMarshalCode},\`;`;
        return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode} 
}`;
    });
    return marshalProperties.join('\n');
}
/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }) {
    return `marshal(){
  let json = '{'
${renderer.indent(renderMarshalProperties(model))}

  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}
function renderUnmarshalProperty(modelInstanceVariable, model) {
    //Referenced enums only need standard marshalling, so lets filter those away
    if (model instanceof models_1.ConstrainedReferenceModel &&
        model.ref instanceof models_1.ConstrainedEnumModel) {
        return `${model.type}.unmarshal(${modelInstanceVariable})`;
    }
    return `${modelInstanceVariable}`;
}
function renderUnmarshalProperties(model) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.entries(properties)];
    const normalProperties = propertyKeys.filter(([, propModel]) => !(propModel instanceof models_1.ConstrainedDictionaryModel) ||
        propModel.serializationType === 'normal');
    const unmarshalNormalProperties = normalProperties.map(([prop, propModel]) => {
        const modelInstanceVariable = `obj["${propModel.unconstrainedPropertyName}"]`;
        const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, propModel.property);
        return `if (${modelInstanceVariable} !== undefined) {
  instance.${prop} = ${unmarshalCode};
}`;
    });
    return `
${unmarshalNormalProperties.join('\n')}

`;
}
function renderUnmarshalUnwrapProperties(model, renderer) {
    const unmarshalAdditionalProperties = [];
    const setAdditionalPropertiesMap = [];
    const unwrappedDictionaryProperties = Object.entries(model.properties).filter(([, propModel]) => propModel instanceof models_1.ConstrainedDictionaryModel &&
        propModel.serializationType === 'unwrap');
    for (const [prop] of unwrappedDictionaryProperties) {
        const modelInstanceVariable = 'value';
        const unmarshalCode = renderUnmarshalProperty(modelInstanceVariable, model);
        setAdditionalPropertiesMap.push(`if (instance.${prop} === undefined) {instance.${prop} = new Map();}`);
        unmarshalAdditionalProperties.push(`instance.${prop}.set(key, ${unmarshalCode});`);
    }
    const propertyNames = Object.values(model.properties).map((model) => `"${model.unconstrainedPropertyName}"`);
    return `
//Not part of core properties
${setAdditionalPropertiesMap.join('\n')}
//Only go over remaining. properties 
for (const [key, value] of Object.entries(obj).filter((([key,]) => {return ![${propertyNames}].includes(key);}))) {
${renderer.indent(unmarshalAdditionalProperties.join('\n'), 2)}
}`;
}
/**
 * Render `unmarshal` function based on model
 */
function renderUnmarshal({ renderer, model }) {
    const unmarshalProperties = renderUnmarshalProperties(model);
    const unmarshalUnwrapProperties = renderUnmarshalUnwrapProperties(model, renderer);
    return `unmarshal(json){
  const obj = typeof json === "object" ? json : JSON.parse(json);
  const instance = new ${model.name}({});

${renderer.indent(unmarshalProperties)}

${renderer.indent(unmarshalUnwrapProperties)}

  return instance;
}`;
}
/**
 * Preset which adds `marshal`, `unmarshal` functions to class.
 *
 * @implements {JavaScriptPreset}
 */
exports.JS_COMMON_PRESET = {
    class: {
        additionalContent({ renderer, model, content, options }) {
            options = options || {};
            const blocks = [];
            if (options.marshalling === true) {
                blocks.push(renderMarshal({ renderer, model }));
                blocks.push(renderUnmarshal({ renderer, model }));
            }
            if (options.example === true) {
                blocks.push((0, ExampleFunction_1.default)({ model }));
            }
            return renderer.renderBlock([content, ...blocks], 2);
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map