"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TS_DEFAULT_PRESET = void 0;
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const InterfaceRenderer_1 = require("./renderers/InterfaceRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const TypeRenderer_1 = require("./renderers/TypeRenderer");
exports.TS_DEFAULT_PRESET = {
    class: ClassRenderer_1.TS_DEFAULT_CLASS_PRESET,
    interface: InterfaceRenderer_1.TS_DEFAULT_INTERFACE_PRESET,
    enum: EnumRenderer_1.TS_DEFAULT_ENUM_PRESET,
    type: TypeRenderer_1.TS_DEFAULT_TYPE_PRESET
};
//# sourceMappingURL=TypeScriptPreset.js.map