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
exports.TS_JSONBINPACK_PRESET = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const alterschema = require('alterschema');
function getInputSchema(originalInput) {
    if (originalInput.$schema !== undefined) {
        if (originalInput.$schema.includes('http://json-schema.org/draft-04/schema')) {
            return 'draft4';
        }
        if (originalInput.$schema.includes('http://json-schema.org/draft-06/schema')) {
            return 'draft6';
        }
    }
    return 'draft7';
}
/**
 * Preset which adds jsonbinpack marshalling/unmarshalling methods
 *
 * @implements {TypeScriptPreset}
 */
exports.TS_JSONBINPACK_PRESET = {
    class: {
        additionalContent({ renderer, content, model }) {
            return __awaiter(this, void 0, void 0, function* () {
                renderer.dependencyManager.addDependency("const jsonbinpack = require('jsonbinpack')");
                const jsonSchema = yield alterschema(model.originalInput, getInputSchema(model.originalInput), '2020-12');
                jsonSchema['$schema'] = 'https://json-schema.org/draft/2020-12/schema';
                const json = JSON.stringify(jsonSchema);
                const packContent = `public async jsonbinSerialize(): Promise<Buffer>{
  const jsonData = JSON.parse(this.marshal());
  const jsonbinpackEncodedSchema = await jsonbinpack.compileSchema(${json});
  return jsonbinpack.serialize(jsonbinpackEncodedSchema, jsonData);
}

public static async jsonbinDeserialize(buffer: Buffer): Promise<${model.name}> {
  const jsonbinpackEncodedSchema = await jsonbinpack.compileSchema(${json});
  const json = jsonbinpack.deserialize(jsonbinpackEncodedSchema, buffer);
  return ${model.name}.unmarshal(json);
}`;
                return `${content}\n${packContent}`;
            });
        }
    }
};
//# sourceMappingURL=JsonBinPackPreset.js.map