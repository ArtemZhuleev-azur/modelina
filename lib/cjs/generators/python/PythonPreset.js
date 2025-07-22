"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PYTHON_PRESETS = exports.PYTHON_DEFAULT_PRESET = void 0;
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const PythonDataClassPreset_1 = require("./presets/PythonDataClassPreset");
const PythonAttrsPreset_1 = require("./presets/PythonAttrsPreset");
exports.PYTHON_DEFAULT_PRESET = {
    class: ClassRenderer_1.PYTHON_DEFAULT_CLASS_PRESET,
    enum: EnumRenderer_1.PYTHON_DEFAULT_ENUM_PRESET
};
exports.PYTHON_PRESETS = {
    default: exports.PYTHON_DEFAULT_PRESET,
    dataclass: PythonDataClassPreset_1.PYTHON_DATACLASS_PRESET,
    attrs: PythonAttrsPreset_1.PYTHON_ATTRS_PRESET
};
//# sourceMappingURL=PythonPreset.js.map