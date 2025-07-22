"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedJavaKeyword = exports.RESERVED_JAVA_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_JAVA_KEYWORDS = [
    'abstract',
    'continue',
    'for',
    'new',
    'switch',
    'assert',
    'default',
    'goto',
    'package',
    'synchronized',
    'boolean',
    'do',
    'if',
    'private',
    'this',
    'break',
    'double',
    'implements',
    'protected',
    'throw',
    'byte',
    'else',
    'import',
    'public',
    'throws',
    'case',
    'enum',
    'instanceof',
    'return',
    'transient',
    'catch',
    'extends',
    'int',
    'short',
    'try',
    'char',
    'final',
    'interface',
    'static',
    'void',
    'class',
    'finally',
    'long',
    'strictfp',
    'volatile',
    'const',
    'float',
    'native',
    'super',
    'while',
    'record'
];
function isReservedJavaKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_JAVA_KEYWORDS, forceLowerCase);
}
exports.isReservedJavaKeyword = isReservedJavaKeyword;
//# sourceMappingURL=Constants.js.map