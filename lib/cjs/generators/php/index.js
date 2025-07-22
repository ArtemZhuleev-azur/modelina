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
exports.phpDefaultPropertyKeyConstraints = exports.PhpDefaultPropertyKeyConstraints = exports.phpDefaultModelNameConstraints = exports.PhpDefaultModelNameConstraints = exports.phpDefaultEnumValueConstraints = exports.PhpDefaultEnumKeyConstraints = exports.phpDefaultEnumKeyConstraints = exports.PHP_DEFAULT_PRESET = void 0;
__exportStar(require("./PhpGenerator"), exports);
__exportStar(require("./PhpFileGenerator"), exports);
var PhpPreset_1 = require("./PhpPreset");
Object.defineProperty(exports, "PHP_DEFAULT_PRESET", { enumerable: true, get: function () { return PhpPreset_1.PHP_DEFAULT_PRESET; } });
__exportStar(require("./presets"), exports);
var EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
Object.defineProperty(exports, "phpDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumKeyConstraints; } });
Object.defineProperty(exports, "PhpDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.DefaultEnumKeyConstraints; } });
Object.defineProperty(exports, "phpDefaultEnumValueConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumValueConstraints; } });
var ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
Object.defineProperty(exports, "PhpDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.DefaultModelNameConstraints; } });
Object.defineProperty(exports, "phpDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.defaultModelNameConstraints; } });
var PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
Object.defineProperty(exports, "PhpDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.DefaultPropertyKeyConstraints; } });
Object.defineProperty(exports, "phpDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.defaultPropertyKeyConstraints; } });
//# sourceMappingURL=index.js.map