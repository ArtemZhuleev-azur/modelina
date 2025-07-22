"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedRustKeyword = exports.RESERVED_RUST_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_RUST_KEYWORDS = [
    // strict keywords can only be used in correct context, and are therefore invalid as:
    // Items, variables and function parameters, fields and vairants, type parameters, lifetime parameters, loop labels, macros or attributes, macro placeholders
    // https://doc.rust-lang.org/reference/keywords.html#strict-keywords
    'as',
    'async',
    'await',
    'break',
    'const',
    'continue',
    'crate',
    'dyn',
    'else',
    'enum',
    'extern',
    'false',
    'fn',
    'for',
    'if',
    'impl',
    'in',
    'let',
    'loop',
    'match',
    'mod',
    'move',
    'mut',
    'pub',
    'ref',
    'return',
    'self',
    'Self',
    'static',
    'struct',
    'super',
    'trait',
    'true',
    'try',
    'type',
    'unsafe',
    'use',
    'where',
    'while',
    // weak keywrods
    // these keywords have special meaning only in certain contexts, but are included as reserved keywords here for simplicity
    'union',
    "'static",
    'macro_rules',
    // keywords reserved for future use
    // https://doc.rust-lang.org/reference/keywords.html#reserved-keywords
    'abstract',
    'become',
    'box',
    'do',
    'final',
    'macro',
    'override',
    'priv',
    'typeof',
    'unsized',
    'yield'
];
function isReservedRustKeyword(word) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_RUST_KEYWORDS, false);
}
exports.isReservedRustKeyword = isReservedRustKeyword;
//# sourceMappingURL=Constants.js.map