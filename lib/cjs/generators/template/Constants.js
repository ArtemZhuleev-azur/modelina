"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReservedTemplateKeyword = exports.RESERVED_TEMPLATE_KEYWORDS = void 0;
const helpers_1 = require("../../helpers");
exports.RESERVED_TEMPLATE_KEYWORDS = ['abstract', 'continue'];
function isReservedTemplateKeyword(word, forceLowerCase = true) {
    return (0, helpers_1.checkForReservedKeyword)(word, exports.RESERVED_TEMPLATE_KEYWORDS, forceLowerCase);
}
exports.isReservedTemplateKeyword = isReservedTemplateKeyword;
//# sourceMappingURL=Constants.js.map