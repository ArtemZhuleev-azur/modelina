"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnum = exports.isPrimitive = exports.isStringRenderingType = exports.isReservedCSharpKeyword = exports.RESERVED_CSHARP_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
const models_1 = require("../../models");
exports.RESERVED_CSHARP_KEYWORDS = [
    'abstract',
    'as',
    'base',
    'bool',
    'break',
    'byte',
    'case',
    'catch',
    'char',
    'checked',
    'class',
    'const',
    'continue',
    'decimal',
    'default',
    'delegate',
    'do',
    'double',
    'else',
    'enum',
    'event',
    'explicit',
    'extern',
    'false',
    'finally',
    'fixed',
    'float',
    'for',
    'foreach',
    'goto',
    'if',
    'implicit',
    'in',
    'int',
    'interface',
    'internal',
    'is',
    'lock',
    'long',
    'namespace',
    'new',
    'null',
    'object',
    'operator',
    'out',
    'override',
    'params',
    'private',
    'protected',
    'public',
    'readonly',
    'record',
    'ref',
    'return',
    'sbyte',
    'sealed',
    'short',
    'sizeof',
    'stackalloc',
    'static',
    'string',
    'struct',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'uint',
    'ulong',
    'unchecked',
    'unsafe',
    'ushort',
    'using',
    'virtual',
    'void',
    'volatile',
    'while'
];
function isReservedCSharpKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_CSHARP_KEYWORDS, forceLowerCase);
}
exports.isReservedCSharpKeyword = isReservedCSharpKeyword;
const STRING_RENDERING_TYPES = [
    'System.TimeSpan',
    'System.DateTime',
    'System.DateTimeOffset',
    'System.Guid'
];
const PRIMITIVES = [
    'bool',
    'byte',
    'sbyte',
    'char',
    'decimal',
    'double',
    'float',
    'int',
    'uint',
    'long',
    'ulong',
    'short',
    'ushort'
];
function isStringRenderingType(property) {
    return STRING_RENDERING_TYPES.includes(property.property.type);
}
exports.isStringRenderingType = isStringRenderingType;
function isPrimitive(property) {
    return PRIMITIVES.includes(property.property.type);
}
exports.isPrimitive = isPrimitive;
function isEnum(property) {
    if (property.property &&
        property.property instanceof models_1.ConstrainedReferenceModel &&
        property.property.ref !== undefined &&
        property.property.ref instanceof models_1.ConstrainedEnumModel) {
        return true;
    }
    return false;
}
exports.isEnum = isEnum;
//# sourceMappingURL=Constants.js.map