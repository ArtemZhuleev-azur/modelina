"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEnumValueConstraints = exports.defaultEnumKeyConstraints = void 0;
/**
 * Enums for JS do not have any constraints because we never render anything specific for enums.
 **/
function defaultEnumKeyConstraints() {
    return ({ enumKey }) => {
        return enumKey;
    };
}
exports.defaultEnumKeyConstraints = defaultEnumKeyConstraints;
function defaultEnumValueConstraints() {
    return ({ enumValue }) => {
        return enumValue;
    };
}
exports.defaultEnumValueConstraints = defaultEnumValueConstraints;
//# sourceMappingURL=EnumConstrainer.js.map