"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_COMMON_PRESET = void 0;
const helpers_1 = require("../../../helpers");
const models_1 = require("../../../models");
/**
 * Render `equal` function based on model's properties
 */
function renderEqual({ renderer, model }) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.keys(properties)];
    const equalProperties = propertyKeys
        .map((propertyName) => {
        return `Objects.equals(this.${propertyName}, self.${propertyName})`;
    })
        .join(' &&\n');
    return `${renderer.renderAnnotation('Override')}
public boolean equals(Object o) {
  if (this == o) {
    return true;
  }
  if (o == null || getClass() != o.getClass()) {
    return false;
  }
  ${model.name} self = (${model.name}) o;
    return 
${equalProperties.length > 0 ? renderer.indent(equalProperties, 6) : 'true'};
}`;
}
/**
 * Render `hashCode` function based on model's properties
 */
function renderHashCode({ renderer, model }) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.keys(properties)];
    //Object casting needed because otherwise properties with arrays fails to be compiled.
    const hashProperties = propertyKeys
        .map((propertyName) => `(Object)${propertyName}`)
        .join(', ');
    return `${renderer.renderAnnotation('Override')}
public int hashCode() {
  return Objects.hash(${hashProperties});
}`;
}
/**
 * Render `toString` function based on model's properties
 */
function renderToString({ renderer, model }) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.keys(properties)];
    const toStringProperties = propertyKeys.map((propertyName) => {
        return `"    ${propertyName}: " + toIndentedString(${propertyName}) + "\\n" +`;
    });
    return `${renderer.renderAnnotation('Override')}
public String toString() {
  return "class ${model.name} {\\n" +   
${toStringProperties.length > 0
        ? renderer.indent(renderer.renderBlock(toStringProperties), 4)
        : ''}
  "}";
}

${renderer.renderComments([
        'Convert the given object to string with each line indented by 4 spaces',
        '(except the first line).'
    ])}
private String toIndentedString(Object o) {
  if (o == null) {
    return "null";
  }
  return o.toString().replace("\\n", "\\n    ");
}`;
}
function renderMarshalProperties({ model }) {
    const properties = model.properties || {};
    const propertyKeys = [...Object.keys(properties)];
    const marshalProperties = propertyKeys.map((propertyName) => {
        const modelInstanceVariable = `this.${propertyName}`;
        return `if(${modelInstanceVariable} != null) {
        propList.add("${propertyName}:"+${modelInstanceVariable}.toString());
    }`;
    });
    return marshalProperties.join('\n');
}
/**
 * Render `marshal` function based on model's properties
 */
function renderMarshalling({ renderer, model }) {
    return `public String marshal() {
  List<String> propList = new ArrayList();
  ${renderer.indent(renderMarshalProperties({ model }))}
  return propList.stream().collect(Collectors.joining(","));
}`;
}
function renderUnmarshalProperties({ model }) {
    const properties = model.properties || {};
    const unmarshalProperties = Object.entries(properties).map(([propertyName, property]) => {
        const setterFunction = `set${propertyName
            .charAt(0)
            .toUpperCase()}${propertyName.slice(1)}`;
        if (property instanceof models_1.ConstrainedArrayModel) {
            return `if(jsonObject.has("${propertyName}")) {
        JSONArray jsonArray = jsonObject.getJSONArray("${propertyName}");
        String[] ${propertyName} = new String[jsonArray.length()];
        for(int i = 0; i < jsonArray.length(); i++) {
          ${propertyName}[i] = jsonArray.getString(i);
        }      
        result.${setterFunction}(${propertyName});
      }`;
        }
        const getType = `jsonObject.get${helpers_1.FormatHelpers.upperFirst(property.property.type)}`;
        return `if(jsonObject.has("${propertyName}")) {
        result.${setterFunction}(${getType}("${propertyName}"));
      }`;
    });
    return unmarshalProperties.join('\n');
}
/**
 * Render `unmarshal` function based on model's properties
 */
function renderUnmarshalling({ renderer, model }) {
    return `public static ${model.name} unmarshal(String json) {
  ${model.name} result = new ${model.name}();
  JSONObject jsonObject = new JSONObject(json);
  ${renderer.indent(renderUnmarshalProperties({ model }))}
  return result;
}`;
}
/**
 * Preset which adds `equal`, `hashCode`, `toString` functions to class.
 *
 * @implements {JavaPreset}
 */
exports.JAVA_COMMON_PRESET = {
    class: {
        additionalContent({ renderer, model, content, options }) {
            if (model.options.isExtended) {
                return '';
            }
            options = options || {};
            const blocks = [];
            const shouldContainEqual = options.equal === undefined || options.equal === true;
            const shouldContainHashCode = options.hashCode === undefined || options.hashCode === true;
            const shouldContainToString = options.classToString === undefined || options.classToString === true;
            const shouldContainMarshal = options.marshalling === true;
            if (shouldContainEqual === true || shouldContainHashCode === true) {
                renderer.dependencyManager.addDependency('import java.util.Objects;');
            }
            if (shouldContainMarshal === true) {
                renderer.dependencyManager.addDependency('import java.util.stream;');
                renderer.dependencyManager.addDependency('import org.json.JSONObject;');
                renderer.dependencyManager.addDependency('import java.util.Map;');
            }
            if (shouldContainEqual) {
                blocks.push(renderEqual({ renderer, model }));
            }
            if (shouldContainHashCode) {
                blocks.push(renderHashCode({ renderer, model }));
            }
            if (shouldContainToString) {
                blocks.push(renderToString({ renderer, model }));
            }
            if (shouldContainMarshal === true) {
                blocks.push(renderMarshalling({ renderer, model }));
                blocks.push(renderUnmarshalling({ renderer, model }));
            }
            return renderer.renderBlock([content, ...blocks], 2);
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map