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
exports.csharpDefaultPropertyKeyConstraints = exports.CsharpDefaultPropertyKeyConstraints = exports.csharpDefaultModelNameConstraints = exports.CsharpDefaultModelNameConstraints = exports.csharpDefaultEnumValueConstraints = exports.CsharpDefaultEnumKeyConstraints = exports.csharpDefaultEnumKeyConstraints = exports.CSHARP_DEFAULT_PRESET = void 0;
__exportStar(require("./CSharpGenerator"), exports);
__exportStar(require("./CSharpFileGenerator"), exports);
var CSharpPreset_1 = require("./CSharpPreset");
Object.defineProperty(exports, "CSHARP_DEFAULT_PRESET", { enumerable: true, get: function () { return CSharpPreset_1.CSHARP_DEFAULT_PRESET; } });
__exportStar(require("./presets"), exports);
var EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
Object.defineProperty(exports, "csharpDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumKeyConstraints; } });
Object.defineProperty(exports, "CsharpDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.DefaultEnumKeyConstraints; } });
Object.defineProperty(exports, "csharpDefaultEnumValueConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumValueConstraints; } });
var ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
Object.defineProperty(exports, "CsharpDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.DefaultModelNameConstraints; } });
Object.defineProperty(exports, "csharpDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.defaultModelNameConstraints; } });
var PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
Object.defineProperty(exports, "CsharpDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.DefaultPropertyKeyConstraints; } });
Object.defineProperty(exports, "csharpDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.defaultPropertyKeyConstraints; } });
//# sourceMappingURL=index.js.map