"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarshal = void 0;
const helpers_1 = require("../../../../helpers");
const models_1 = require("../../../../models");
function realizePropertyFactory(prop) {
    return `$\{typeof ${prop} === 'number' || typeof ${prop} === 'boolean' ? ${prop} : JSON.stringify(${prop})}`;
}
function renderMarshalProperty(modelInstanceVariable, model) {
    if (model instanceof models_1.ConstrainedReferenceModel &&
        !(model.ref instanceof models_1.ConstrainedEnumModel)) {
        return `$\{${modelInstanceVariable}.marshal()}`;
    }
    return realizePropertyFactory(modelInstanceVariable);
}
/**
 * Render marshalling logic for tuples
 */
function renderTupleSerialization(modelInstanceVariable, unconstrainedProperty, tuple) {
    const t = tuple.tuple.map((tupleEntry) => {
        const temp = renderMarshalProperty(`${modelInstanceVariable}[${tupleEntry.index}]`, tupleEntry.value);
        return `if(${modelInstanceVariable}[${tupleEntry.index}]) {
  serializedTuple[${tupleEntry.index}] = \`${temp}\`
} else {
  serializedTuple[${tupleEntry.index}] = null;
}`;
    });
    return `const serializedTuple: any[] = [];
${t.join('\n')}
json += \`"${unconstrainedProperty}": [\${serializedTuple.join(',')}],\`;`;
}
/**
 * Render marshalling logic for unions
 */
function renderUnionSerializationArray(modelInstanceVariable, prop, unconstrainedProperty, unionModel) {
    const propName = `${prop}JsonValues`;
    const allUnionReferences = unionModel.union
        .filter((model) => {
        return (model instanceof models_1.ConstrainedReferenceModel &&
            !(model.ref instanceof models_1.ConstrainedEnumModel));
    })
        .map((model) => {
        return `unionItem instanceof ${model.type}`;
    });
    const allUnionReferencesCondition = allUnionReferences.join(' || ');
    const hasUnionReference = allUnionReferences.length > 0;
    let unionSerialization = `${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))`;
    if (hasUnionReference) {
        unionSerialization = `if(${allUnionReferencesCondition}) {
      ${propName}.push(unionItem.marshal());
    } else {
      ${propName}.push(typeof unionItem === 'number' || typeof unionItem === 'boolean' ? unionItem : JSON.stringify(unionItem))
    }`;
    }
    return `const ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${unionSerialization}
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}
/**
 * Render marshalling logic for Arrays
 */
function renderArraySerialization(modelInstanceVariable, prop, unconstrainedProperty, arrayModel) {
    const propName = `${prop}JsonValues`;
    return `let ${propName}: any[] = [];
  for (const unionItem of ${modelInstanceVariable}) {
    ${propName}.push(\`${renderMarshalProperty('unionItem', arrayModel.valueModel)}\`);
  }
  json += \`"${unconstrainedProperty}": [\${${propName}.join(',')}],\`;`;
}
/**
 * Render marshalling logic for unions
 */
function renderUnionSerialization(modelInstanceVariable, unconstrainedProperty, unionModel) {
    const allUnionReferences = unionModel.union
        .filter((model) => {
        return (model instanceof models_1.ConstrainedReferenceModel &&
            !(model.ref instanceof models_1.ConstrainedEnumModel));
    })
        .map((model) => {
        return `${modelInstanceVariable} instanceof ${model.type}`;
    });
    const allUnionReferencesCondition = allUnionReferences.join(' || ');
    const hasUnionReference = allUnionReferences.length > 0;
    if (hasUnionReference) {
        return `if(${allUnionReferencesCondition}) {
      json += \`"${unconstrainedProperty}": $\{${modelInstanceVariable}.marshal()},\`;
    } else {
      json += \`"${unconstrainedProperty}": ${realizePropertyFactory(modelInstanceVariable)},\`;
    }`;
    }
    return `json += \`"${unconstrainedProperty}": ${realizePropertyFactory(modelInstanceVariable)},\`;`;
}
/**
 * Render marshalling logic for dictionary types
 */
function renderDictionarySerialization(properties) {
    const unwrapDictionaryProperties = (0, helpers_1.getDictionary)(properties);
    const originalPropertyNames = (0, helpers_1.getOriginalPropertyList)(properties);
    return unwrapDictionaryProperties.map(([prop, propModel]) => {
        let dictionaryValueType;
        if (propModel.property.value instanceof
            models_1.ConstrainedUnionModel) {
            dictionaryValueType = renderUnionSerialization('value', '${key}', propModel.property
                .value);
        }
        else {
            const type = renderMarshalProperty('value', propModel.property);
            dictionaryValueType = `json += \`"$\{key}": ${type},\`;`;
        }
        return `if(this.${prop} !== undefined) { 
  for (const [key, value] of this.${prop}.entries()) {
    //Only unwrap those that are not already a property in the JSON object
    if([${originalPropertyNames
            .map((value) => `"${value}"`)
            .join(',')}].includes(String(key))) continue;
    ${dictionaryValueType}
  }
}`;
    });
}
/**
 * Render marshalling code for all the normal properties (not dictionaries with unwrap)
 */
function renderNormalProperties(properties) {
    const normalProperties = (0, helpers_1.getNormalProperties)(properties);
    return normalProperties.map(([prop, propModel]) => {
        const modelInstanceVariable = `this.${prop}`;
        let marshalCode;
        if (propModel.property instanceof models_1.ConstrainedArrayModel &&
            propModel.property.valueModel instanceof models_1.ConstrainedUnionModel) {
            marshalCode = renderUnionSerializationArray(modelInstanceVariable, prop, propModel.unconstrainedPropertyName, propModel.property.valueModel);
        }
        else if (propModel.property instanceof models_1.ConstrainedUnionModel) {
            marshalCode = renderUnionSerialization(modelInstanceVariable, propModel.unconstrainedPropertyName, propModel.property);
        }
        else if (propModel.property instanceof models_1.ConstrainedArrayModel) {
            marshalCode = renderArraySerialization(modelInstanceVariable, prop, propModel.unconstrainedPropertyName, propModel.property);
        }
        else if (propModel.property instanceof models_1.ConstrainedTupleModel) {
            marshalCode = renderTupleSerialization(modelInstanceVariable, propModel.unconstrainedPropertyName, propModel.property);
        }
        else {
            const propMarshalCode = renderMarshalProperty(modelInstanceVariable, propModel.property);
            marshalCode = `json += \`"${propModel.unconstrainedPropertyName}": ${propMarshalCode},\`;`;
        }
        return `if(${modelInstanceVariable} !== undefined) {
  ${marshalCode}
}`;
    });
}
/**
 * Render `marshal` function based on model
 */
function renderMarshal({ renderer, model }) {
    const properties = model.properties || {};
    const marshalNormalProperties = renderNormalProperties(properties);
    const marshalUnwrapDictionaryProperties = renderDictionarySerialization(properties);
    return `public marshal() : string {
  let json = '{'
${renderer.indent(marshalNormalProperties.join('\n'))}
${renderer.indent(marshalUnwrapDictionaryProperties.join('\n'))}
  //Remove potential last comma 
  return \`$\{json.charAt(json.length-1) === ',' ? json.slice(0, json.length-1) : json}}\`;
}`;
}
exports.renderMarshal = renderMarshal;
//# sourceMappingURL=MarshalFunction.js.map