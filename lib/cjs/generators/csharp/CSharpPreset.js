"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSHARP_DEFAULT_PRESET = void 0;
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const RecordRenderer_1 = require("./renderers/RecordRenderer");
exports.CSHARP_DEFAULT_PRESET = {
    class: ClassRenderer_1.CSHARP_DEFAULT_CLASS_PRESET,
    record: RecordRenderer_1.CSHARP_DEFAULT_RECORD_PRESET,
    enum: EnumRenderer_1.CSHARP_DEFAULT_ENUM_PRESET
};
//# sourceMappingURL=CSharpPreset.js.map