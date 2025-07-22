"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_DEFAULT_PRESET = void 0;
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const RecordRenderer_1 = require("./renderers/RecordRenderer");
const UnionRenderer_1 = require("./renderers/UnionRenderer");
exports.JAVA_DEFAULT_PRESET = {
    record: RecordRenderer_1.JAVA_DEFAULT_RECORD_PRESET,
    class: ClassRenderer_1.JAVA_DEFAULT_CLASS_PRESET,
    enum: EnumRenderer_1.JAVA_DEFAULT_ENUM_PRESET,
    union: UnionRenderer_1.JAVA_DEFAULT_UNION_PRESET
};
//# sourceMappingURL=JavaPreset.js.map