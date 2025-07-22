"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PYTHON_JSON_SERIALIZER_PRESET = void 0;
/**
 * Preset which adds JSON serialization and deserialization to the generated
 * Python classes.
 *
 * @implements {PythonPreset}
 */
exports.PYTHON_JSON_SERIALIZER_PRESET = {
    class: {
        additionalContent({ renderer, model, content }) {
            renderer.dependencyManager.addDependency('import json');
            const serializeContent = `def serialize_to_json(self):
  return json.dumps(self.__dict__, default=lambda o: o.__dict__, indent=2)`.trim();
            const deserializeContent = `@staticmethod
def deserialize_from_json(json_string):
  return ${model.name}(**json.loads(json_string))`.trim();
            return renderer.renderBlock([content, serializeContent, deserializeContent], 2);
        }
    }
};
//# sourceMappingURL=JsonSerializer.js.map