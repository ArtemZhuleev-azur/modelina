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
exports.goDefaultPropertyKeyConstraints = exports.GoDefaultPropertyKeyConstraints = exports.goDefaultModelNameConstraints = exports.GoDefaultModelNameConstraints = exports.goDefaultEnumValueConstraints = exports.GoDefaultEnumKeyConstraints = exports.goDefaultEnumKeyConstraints = exports.GO_DEFAULT_PRESET = void 0;
__exportStar(require("./GoGenerator"), exports);
__exportStar(require("./GoFileGenerator"), exports);
var GoPreset_1 = require("./GoPreset");
Object.defineProperty(exports, "GO_DEFAULT_PRESET", { enumerable: true, get: function () { return GoPreset_1.GO_DEFAULT_PRESET; } });
__exportStar(require("./presets"), exports);
var EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
Object.defineProperty(exports, "goDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumKeyConstraints; } });
Object.defineProperty(exports, "GoDefaultEnumKeyConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.DefaultEnumKeyConstraints; } });
Object.defineProperty(exports, "goDefaultEnumValueConstraints", { enumerable: true, get: function () { return EnumConstrainer_1.defaultEnumValueConstraints; } });
var ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
Object.defineProperty(exports, "GoDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.DefaultModelNameConstraints; } });
Object.defineProperty(exports, "goDefaultModelNameConstraints", { enumerable: true, get: function () { return ModelNameConstrainer_1.defaultModelNameConstraints; } });
var PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
Object.defineProperty(exports, "GoDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.DefaultPropertyKeyConstraints; } });
Object.defineProperty(exports, "goDefaultPropertyKeyConstraints", { enumerable: true, get: function () { return PropertyKeyConstrainer_1.defaultPropertyKeyConstraints; } });
//# sourceMappingURL=index.js.map