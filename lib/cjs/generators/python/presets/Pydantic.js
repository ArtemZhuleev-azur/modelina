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
exports.PYTHON_PYDANTIC_PRESET = void 0;
const models_1 = require("../../../models");
const PYTHON_PYDANTIC_CLASS_PRESET = {
    self({ renderer, model }) {
        return __awaiter(this, void 0, void 0, function* () {
            renderer.dependencyManager.addDependency('from typing import Optional, Any, Union');
            renderer.dependencyManager.addDependency('from pydantic import BaseModel, Field');
            const defaultClassString = yield renderer.defaultSelf();
            return defaultClassString.replace(`class ${model.name}:`, `class ${model.name}(BaseModel):`);
        });
    },
    property({ property, model, renderer }) {
        let type = property.property.type;
        const propertyName = property.propertyName;
        if (property.property instanceof models_1.ConstrainedUnionModel) {
            const unionTypes = property.property.union.map((unionModel) => unionModel.type);
            type = `Union[${unionTypes.join(', ')}]`;
        }
        const isOptional = !property.required || property.property.options.isNullable === true;
        if (isOptional) {
            type = `Optional[${type}]`;
        }
        type = renderer.renderPropertyType({
            modelType: model.type,
            propertyType: type
        });
        const decoratorArgs = [];
        if (property.property.originalInput['description']) {
            decoratorArgs.push(`description='''${property.property.originalInput['description']}'''`);
        }
        if (isOptional) {
            decoratorArgs.push('default=None');
        }
        if (property.property.options.const) {
            decoratorArgs.push(`default=${property.property.options.const.value}`);
            decoratorArgs.push('frozen=True');
        }
        if (property.property instanceof models_1.ConstrainedDictionaryModel &&
            property.property.serializationType === 'unwrap') {
            decoratorArgs.push('exclude=True');
        }
        if (property.propertyName !== property.unconstrainedPropertyName &&
            (!(property.property instanceof models_1.ConstrainedDictionaryModel) ||
                property.property.serializationType !== 'unwrap')) {
            decoratorArgs.push(`alias='''${property.unconstrainedPropertyName}'''`);
        }
        return `${propertyName}: ${type} = Field(${decoratorArgs.join(', ')})`;
    },
    ctor: () => '',
    getter: () => '',
    setter: () => '',
    additionalContent: ({ content, model, renderer }) => {
        const allProperties = Object.keys(model.properties);
        let dictionaryModel;
        for (const property of Object.values(model.properties)) {
            if (property.property instanceof models_1.ConstrainedDictionaryModel &&
                property.property.serializationType === 'unwrap') {
                dictionaryModel = property;
            }
        }
        const shouldHaveFunctions = dictionaryModel !== undefined;
        if (!shouldHaveFunctions) {
            return content;
        }
        renderer.dependencyManager.addDependency('from pydantic import model_serializer, model_validator');
        // eslint-disable-next-line prettier/prettier
        return `@model_serializer(mode='wrap')
def custom_serializer(self, handler):
  serialized_self = handler(self)
  ${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName} = getattr(self, "${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}")
  if ${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName} is not None:
    for key, value in ${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}.items():
      # Never overwrite existing values, to avoid clashes
      if not hasattr(serialized_self, key):
        serialized_self[key] = value

  return serialized_self

@model_validator(mode='before')
@classmethod
def unwrap_${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}(cls, data):
  if not isinstance(data, dict):
    data = data.model_dump()
  json_properties = list(data.keys())
  known_object_properties = [${allProperties
            .map((value) => `'${value}'`)
            .join(', ')}]
  unknown_object_properties = [element for element in json_properties if element not in known_object_properties]
  # Ignore attempts that validate regular models, only when unknown input is used we add unwrap extensions
  if len(unknown_object_properties) == 0: 
    return data
  
  known_json_properties = [${Object.values(model.properties)
            .map((value) => `'${value.unconstrainedPropertyName}'`)
            .join(', ')}]
  ${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName} = data.get('${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}', {})
  for obj_key in list(data.keys()):
    if not known_json_properties.__contains__(obj_key):
      ${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}[obj_key] = data.pop(obj_key, None)
  data['${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}'] = ${dictionaryModel === null || dictionaryModel === void 0 ? void 0 : dictionaryModel.propertyName}
  return data
${content}`;
    }
};
exports.PYTHON_PYDANTIC_PRESET = {
    class: PYTHON_PYDANTIC_CLASS_PRESET
};
//# sourceMappingURL=Pydantic.js.map