"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GO_DEFAULT_PRESET = void 0;
const StructRenderer_1 = require("./renderers/StructRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const UnionRenderer_1 = require("./renderers/UnionRenderer");
exports.GO_DEFAULT_PRESET = {
    struct: StructRenderer_1.GO_DEFAULT_STRUCT_PRESET,
    enum: EnumRenderer_1.GO_DEFAULT_ENUM_PRESET,
    union: UnionRenderer_1.GO_DEFAULT_UNION_PRESET
};
//# sourceMappingURL=GoPreset.js.map