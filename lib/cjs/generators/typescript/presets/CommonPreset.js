"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS_COMMON_PRESET = void 0;
const ExampleFunction_1 = __importDefault(require("./utils/ExampleFunction"));
const UnmarshalFunction_1 = require("./utils/UnmarshalFunction");
const MarshalFunction_1 = require("./utils/MarshalFunction");
/**
 * Preset which adds `marshal`, `unmarshal`, `example` functions to class.
 *
 * @implements {TypeScriptPreset}
 */
exports.TS_COMMON_PRESET = {
    class: {
        additionalContent({ renderer, model, content, options }) {
            options = options || {};
            const blocks = [];
            if (options.marshalling === true) {
                blocks.push((0, MarshalFunction_1.renderMarshal)({ renderer, model }));
                blocks.push((0, UnmarshalFunction_1.renderUnmarshal)({ renderer, model }));
            }
            if (options.example === true) {
                blocks.push((0, ExampleFunction_1.default)({ model }));
            }
            return renderer.renderBlock([content, ...blocks], 2);
        }
    }
};
//# sourceMappingURL=CommonPreset.js.map