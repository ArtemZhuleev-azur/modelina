"use strict";
/**
 * For the full list of Kotlin keywords, refer to the reference documentation.
 * https://kotlinlang.org/docs/keyword-reference.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedKotlinKeyword = exports.isInvalidKotlinEnumKey = exports.ILLEGAL_ENUM_FIELDS = exports.RESERVED_KEYWORDS_ILLEGAL_AS_PARAMETER = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_KEYWORDS_ILLEGAL_AS_PARAMETER = [
    'as',
    'as?',
    'break',
    'class',
    'continue',
    'do',
    'else',
    'false',
    'for',
    'fun',
    'if',
    'in',
    '!in',
    'interface',
    'is',
    '!is',
    'null',
    'object',
    'package',
    'return',
    'super',
    'this',
    'throw',
    'true',
    'try',
    'typealias',
    'typeof',
    'val',
    'var',
    'when',
    'while'
];
exports.ILLEGAL_ENUM_FIELDS = ['as?', '!in', '!is'];
function isInvalidKotlinEnumKey(word) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.ILLEGAL_ENUM_FIELDS, true);
}
exports.isInvalidKotlinEnumKey = isInvalidKotlinEnumKey;
function isReservedKotlinKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_KEYWORDS_ILLEGAL_AS_PARAMETER, forceLowerCase);
}
exports.isReservedKotlinKeyword = isReservedKotlinKeyword;
//# sourceMappingURL=Constants.js.map