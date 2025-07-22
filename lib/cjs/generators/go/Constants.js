"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedGoKeyword = exports.RESERVED_GO_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_GO_KEYWORDS = [
    'break',
    'case',
    'chan',
    'const',
    'continue',
    'default',
    'defer',
    'else',
    'fallthrough',
    'for',
    'func',
    'go',
    'goto',
    'if',
    'import',
    'interface',
    'map',
    'package',
    'range',
    'return',
    'select',
    'struct',
    'switch',
    'type',
    'var'
];
function isReservedGoKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_GO_KEYWORDS, forceLowerCase);
}
exports.isReservedGoKeyword = isReservedGoKeyword;
//# sourceMappingURL=Constants.js.map