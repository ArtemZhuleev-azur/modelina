"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeScriptDefaultPropertyKeyConstraints = exports.TypeScriptDefaultPropertyKeyConstraints = exports.typeScriptDefaultModelNameConstraints = exports.TypeScriptDefaultModelNameConstraints = exports.typeScriptDefaultEnumValueConstraints = exports.TypeScriptDefaultEnumKeyConstraints = exports.typeScriptDefaultEnumKeyConstraints = exports.TS_DEFAULT_PRESET = void 0;
__exportStar(require("./TypeScriptGenerator"), exports);
__exportStar(require("./TypeScriptFileGenerator"), exports);
var TypeScriptPreset_1 = require("./TypeScriptPreset");
Object.defineProperty(exports, "TS_DEFAULT_PRESET", { enumerable: true, get: function () { return TypeScriptPreset_1.TS_DEFAULT_PRESET; } });
__exportStar(require("./presets"), exports);
var EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
Object.defineProperty(exports, "typeScriptDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumKeyConstraints; } });
Object.defineProperty(exports, "TypeScriptDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.DefaultEnumKeyConstraints; } });
Object.defineProperty(exports, "typeScriptDefaultEnumValueConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumValueConstraints; } });
var ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
Object.defineProperty(exports, "TypeScriptDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.DefaultModelNameConstraints; } });
Object.defineProperty(exports, "typeScriptDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.defaultModelNameConstraints; } });
var PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
Object.defineProperty(exports, "TypeScriptDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.DefaultPropertyKeyConstraints; } });
Object.defineProperty(exports, "typeScriptDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.defaultPropertyKeyConstraints; } });
//# sourceMappingURL=index.js.map