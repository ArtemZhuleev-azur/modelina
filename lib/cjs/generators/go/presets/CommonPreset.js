"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GO_COMMON_PRESET = void 0;
const models_1 = require("../../../models");
function renderJSONTag({ field }) {
    if (field.property instanceof models_1.ConstrainedDictionaryModel &&
        field.property.serializationType === 'unwrap') {
        return `json:"-,omitempty"`;
    }
    if (field.required) {
        return `json:"${field.unconstrainedPropertyName}" binding:"required"`;
    }
    return `json:"${field.unconstrainedPropertyName},omitempty"`;
}
function renderMarshallingFunctions({ model, renderer }) {
    renderer.dependencyManager.addDependency('encoding/json');
    return `
func (op *${model.name}) UnmarshalJSON(raw []byte) error {
  var v any
  if err := json.Unmarshal(raw, &v); err != nil {
  return err
  }
  *op = ValuesTo${model.name}[v]
  return nil
}

func (op ${model.name}) MarshalJSON() ([]byte, error) {
  return json.Marshal(op.Value())
}`;
}
exports.GO_COMMON_PRESET = {
    struct: {
        field: ({ content, field, options }) => {
            const blocks = [];
            if (options.addJsonTag) {
                blocks.push(renderJSONTag({ field }));
            }
            return `${content} \`${blocks.join(' ')}\``;
        }
    },
    enum: {
        additionalContent({ content, model, renderer, options }) {
            const blocks = [];
            if (options.addJsonTag) {
                blocks.push(renderMarshallingFunctions({ model, renderer }));
            }
            return `${content}\n ${blocks.join('\n')}`;
        }
    },
    union: {
        field: ({ content }) => {
            return `${content} \`json:"-,omitempty\``;
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map