"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputMetaModel = void 0;
/**
 * Since each input processor can create multiple meta models this is a wrapper to a MetaModel to make that possible.
 */
class InputMetaModel {
    constructor() {
        this.models = {};
        this.originalInput = {};
    }
}
exports.InputMetaModel = InputMetaModel;
//# sourceMappingURL=InputMetaModel.js.map