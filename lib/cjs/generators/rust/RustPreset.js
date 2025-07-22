"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUST_DEFAULT_PRESET = void 0;
const StructRenderer_1 = require("./renderers/StructRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const TupleRenderer_1 = require("./renderers/TupleRenderer");
const UnionRenderer_1 = require("./renderers/UnionRenderer");
const PackageRenderer_1 = require("./renderers/PackageRenderer");
exports.RUST_DEFAULT_PRESET = {
    struct: StructRenderer_1.RUST_DEFAULT_STRUCT_PRESET,
    enum: EnumRenderer_1.RUST_DEFAULT_ENUM_PRESET,
    tuple: TupleRenderer_1.RUST_DEFAULT_TUPLE_PRESET,
    union: UnionRenderer_1.RUST_DEFAULT_UNION_PRESET,
    package: PackageRenderer_1.RUST_DEFAULT_PACKAGE_PRESET
};
//# sourceMappingURL=RustPreset.js.map