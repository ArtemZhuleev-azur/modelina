"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEnumValueConstraints = exports.defaultEnumKeyConstraints = exports.DefaultEnumKeyConstraints = void 0;
const helpers_1 = require("../../../helpers");
const Constants_1 = require("../Constants");
exports.DefaultEnumKeyConstraints = {
    NO_SPECIAL_CHAR: (value) => {
        //Exclude '_' because they are allowed as enum keys
        return helpers_1.FormatHelpers.replaceSpecialCharacters(value, {
            exclude: [' ', '_'],
            separator: '_'
        });
    },
    NO_NUMBER_START_CHAR: helpers_1.NO_NUMBER_START_CHAR,
    NO_DUPLICATE_KEYS: helpers_1.NO_DUPLICATE_ENUM_KEYS,
    NO_EMPTY_VALUE: helpers_1.NO_EMPTY_VALUE,
    NAMING_FORMATTER: helpers_1.FormatHelpers.toConstantCase,
    NO_RESERVED_KEYWORDS: (value) => {
        return (0, helpers_1.NO_RESERVED_KEYWORDS)(value, Constants_1.isInvalidKotlinEnumKey);
    }
};
function defaultEnumKeyConstraints(customConstraints) {
    const constraints = Object.assign(Object.assign({}, exports.DefaultEnumKeyConstraints), customConstraints);
    return ({ enumKey, enumModel, constrainedEnumModel }) => {
        let constrainedEnumKey = enumKey;
        constrainedEnumKey = constraints.NO_SPECIAL_CHAR(constrainedEnumKey);
        constrainedEnumKey = constraints.NO_NUMBER_START_CHAR(constrainedEnumKey);
        constrainedEnumKey = constraints.NO_EMPTY_VALUE(constrainedEnumKey);
        constrainedEnumKey = constraints.NO_RESERVED_KEYWORDS(constrainedEnumKey);
        //If the enum key has been manipulated, lets make sure it don't clash with existing keys
        if (constrainedEnumKey !== enumKey) {
            constrainedEnumKey = constraints.NO_DUPLICATE_KEYS(constrainedEnumModel, enumModel, constrainedEnumKey, constraints.NAMING_FORMATTER);
        }
        constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
        return constrainedEnumKey;
    };
}
exports.defaultEnumKeyConstraints = defaultEnumKeyConstraints;
function defaultEnumValueConstraints() {
    return ({ enumValue }) => {
        switch (typeof enumValue) {
            case 'string':
                return `"${enumValue}"`;
            case 'boolean':
            case 'bigint':
            case 'number':
                return enumValue;
            case 'object':
                return `"${JSON.stringify(enumValue).replace(/"/g, '\\"')}"`;
            default:
                return `"${JSON.stringify(enumValue)}"`;
        }
    };
}
exports.defaultEnumValueConstraints = defaultEnumValueConstraints;
//# sourceMappingURL=EnumConstrainer.js.map