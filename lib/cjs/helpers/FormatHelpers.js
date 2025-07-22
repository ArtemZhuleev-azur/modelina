"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatHelpers = exports.IndentationTypes = void 0;
const change_case_1 = require("change-case");
var IndentationTypes;
(function (IndentationTypes) {
    IndentationTypes["TABS"] = "tabs";
    IndentationTypes["SPACES"] = "spaces";
})(IndentationTypes = exports.IndentationTypes || (exports.IndentationTypes = {}));
const specialCharacterReplacements = new Map([
    [' ', 'space'],
    ['!', 'exclamation'],
    ['"', 'quotation'],
    ['#', 'hash'],
    ['$', 'dollar'],
    ['%', 'percent'],
    ['&', 'ampersand'],
    ["'", 'apostrophe'],
    ['(', 'roundleft'],
    [')', 'roundright'],
    ['*', 'asterisk'],
    ['+', 'plus'],
    [',', 'comma'],
    ['-', 'minus'],
    ['.', 'dot'],
    ['/', 'slash'],
    [':', 'colon'],
    [';', 'semicolon'],
    ['<', 'less'],
    ['=', 'equal'],
    ['>', 'greater'],
    ['?', 'question'],
    ['@', 'at'],
    ['[', 'squareleft'],
    ['\\', 'backslash'],
    [']', 'squareright'],
    ['^', 'circumflex'],
    ['_', 'underscore'],
    ['`', 'graveaccent'],
    ['{', 'curlyleft'],
    ['|', 'vertical'],
    ['}', 'curlyright'],
    ['~', 'tilde']
]);
class FormatHelpers {
    /**
     * Upper first char in given string value.
     * @param {string} value to change
     * @returns {string}
     */
    static upperFirst(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }
    /**
     * Lower first char in given string value.
     * @param {string} value to change
     * @returns {string}
     */
    static lowerFirst(value) {
        return value.charAt(0).toLowerCase() + value.slice(1);
    }
    /**
     * Transform into a string with the separator denoted by the next word capitalized.
     * @param {string} value to transform
     * @returns {string}
     */
    static toCamelCase(renderName) {
        const splt = renderName.split(/([0-9]_)/g);
        if (splt.length > 1) {
            return splt
                .map((part) => {
                if (part.match(/[0-9]_/g)) {
                    return part;
                }
                return (0, change_case_1.camelCase)(part);
            })
                .join('');
        }
        return (0, change_case_1.camelCase)(renderName);
    }
    /**
     * Transform into a string of capitalized words without separators
     * merging numbers.
     * @param {string} value to transform
     * @returns {string}
     */
    static toPascalCaseMergingNumbers(value) {
        return (0, change_case_1.pascalCase)(value, { transform: change_case_1.pascalCaseTransformMerge });
    }
    /**
     * Replace special characters (Not 0-9,a-z,A-Z) with character names
     * @param {string} value to transform
     * @param {ReplaceSpecialCharactersOptions} options
     * @returns {string}
     */
    static replaceSpecialCharacters(string, options) {
        var _a;
        const separator = (_a = options === null || options === void 0 ? void 0 : options.separator) !== null && _a !== void 0 ? _a : '';
        return [...string].reduce((sum, c, i) => {
            var _a;
            if ((_a = options === null || options === void 0 ? void 0 : options.exclude) === null || _a === void 0 ? void 0 : _a.includes(c)) {
                return sum + c;
            }
            const replacement = specialCharacterReplacements.get(c);
            if (replacement === undefined) {
                return sum + c;
            }
            return (sum +
                (sum.endsWith(separator) || sum.length === 0 ? '' : separator) +
                replacement +
                (i === string.length - 1 ? '' : separator));
        }, '');
    }
    /**
     * Ensures breaking text into new lines according to newline char (`\n`) in text.
     * @param {(string | string[])} lines to breaks
     * @returns {string[]}
     */
    static breakLines(lines) {
        lines = Array.isArray(lines) ? lines : [lines];
        return lines.map((line) => line.split('\n')).flatMap((line) => line);
    }
    /**
     * Ensures indentations are prepended to content.
     * @param {string} content to prepend the indentation.
     * @param {number} size the number of indentations to use. 1 by default
     * @param {IndentationTypes} type the type of indentations to use. SPACES by default.
     * @returns {string}
     */
    static indent(content = '', size = 1, type = IndentationTypes.SPACES) {
        if (size < 1) {
            return content;
        }
        // if the content includes new lines ensure that they have the added indentation as well.
        if (content.includes('\n')) {
            const newLineArray = content.split('\n');
            return newLineArray.reduce((accumulator, value) => {
                const newValue = value.trim() === ''
                    ? value
                    : `${this.getIndentation(size, type)}${value}`;
                return accumulator === '' ? newValue : `${accumulator}\n${newValue}`;
            }, '');
        }
        return `${this.getIndentation(size, type)}${content}`;
    }
    /**
     * Get the indentation string based on how many and which type of indentation are requested.
     * @private
     * @param {number} size the number of indentations to use
     * @param {IndentationTypes} type the type of indentations to use. SPACES by default.
     * @returns {string}
     */
    static getIndentation(size = 0, type = IndentationTypes.SPACES) {
        const whitespaceChar = type === IndentationTypes.SPACES ? ' ' : '\t';
        return Array(size).fill(whitespaceChar).join('');
    }
    /**
     * Render given JSON Schema example to string
     *
     * @param {Array<Any>} examples to render
     * @returns {string}
     */
    static renderJSONExamples(examples) {
        let renderedExamples = '';
        if (Array.isArray(examples)) {
            for (const example of examples) {
                if (renderedExamples !== '') {
                    renderedExamples += ', ';
                }
                if (typeof example === 'object') {
                    try {
                        renderedExamples += JSON.stringify(example);
                    }
                    catch (ignore) {
                        renderedExamples += example;
                    }
                }
                else {
                    renderedExamples += example;
                }
            }
        }
        return renderedExamples;
    }
    static snakeCase(renderName) {
        return renderName
            .replace(/\W+/g, ' ')
            .split(/ |\B(?=[A-Z])/)
            .map((word) => word.toLowerCase())
            .join('_');
    }
}
exports.FormatHelpers = FormatHelpers;
/**
 * Transform into a string of capitalized words without separators.
 * @param {string} value to transform
 * @returns {string}
 */
FormatHelpers.toPascalCase = change_case_1.pascalCase;
/**
 * Transform into a lower cased string with dashes between words.
 * @param {string} value to transform
 * @returns {string}
 */
FormatHelpers.toParamCase = change_case_1.paramCase;
/**
 * Transform into upper case string with an underscore between words.
 * @param {string} value to transform
 * @returns {string}
 */
FormatHelpers.toConstantCase = change_case_1.constantCase;
/**
 * Transform into lower case string with an underscore between words.
 * @param {string} value to transform
 * @returns {string}
 */
FormatHelpers.toSnakeCase = change_case_1.snakeCase;
//# sourceMappingURL=FormatHelpers.js.map