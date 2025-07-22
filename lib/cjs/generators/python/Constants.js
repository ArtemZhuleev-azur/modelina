"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedPythonKeyword = exports.RESERVED_PYTHON_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_PYTHON_KEYWORDS = [
    'False',
    'def',
    'if',
    'raise',
    'None',
    'del',
    'import',
    'return',
    'True',
    'elif',
    'in',
    'try',
    'and',
    'else',
    'is',
    'while',
    'as',
    'except',
    'lambda',
    'with',
    'assert',
    'finally',
    'nonlocal',
    'yield',
    'break',
    'for',
    'not',
    'class',
    'from',
    'or',
    'continue',
    'global',
    'pass',
    'exec'
];
function isReservedPythonKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_PYTHON_KEYWORDS, forceLowerCase);
}
exports.isReservedPythonKeyword = isReservedPythonKeyword;
//# sourceMappingURL=Constants.js.map