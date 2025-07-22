"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PYTHON_ATTRS_PRESET = void 0;
exports.PYTHON_ATTRS_PRESET = {
    class: {
        self({ renderer }) {
            return `import attr\n\n@attr.s(auto_attribs=True)\n${renderer.defaultSelf()}`;
        }
    }
};
//# sourceMappingURL=PythonAttrsPreset.js.map