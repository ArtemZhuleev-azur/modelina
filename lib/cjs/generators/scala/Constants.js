"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedScalaKeyword = exports.RESERVED_SCALA_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_SCALA_KEYWORDS = [
    'abstract',
    'case',
    'catch',
    'class',
    'def',
    'do',
    'else',
    'extends',
    'false',
    'final',
    'finally',
    'for',
    'forSome',
    'if',
    'implicit',
    'import',
    'lazy',
    'match',
    'new',
    'null',
    'object',
    'override',
    'package',
    'private',
    'protected',
    'return',
    'sealed',
    'super',
    'this',
    'throw',
    'trait',
    'true',
    'try',
    'type',
    'val',
    'var',
    'while',
    'with',
    'yield'
];
function isReservedScalaKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_SCALA_KEYWORDS, forceLowerCase);
}
exports.isReservedScalaKeyword = isReservedScalaKeyword;
//# sourceMappingURL=Constants.js.map