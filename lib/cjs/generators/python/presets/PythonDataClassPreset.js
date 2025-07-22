"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PYTHON_DATACLASS_PRESET = void 0;
exports.PYTHON_DATACLASS_PRESET = {
    class: {
        self({ renderer }) {
            return `from dataclasses import dataclass\n\n@dataclass\n${renderer.defaultSelf()}`;
        }
    }
};
//# sourceMappingURL=PythonDataClassPreset.js.map