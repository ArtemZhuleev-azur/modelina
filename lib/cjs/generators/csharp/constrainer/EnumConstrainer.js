"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEnumValueConstraints = exports.defaultEnumKeyConstraints = exports.DefaultEnumKeyConstraints = void 0;
const Constraints_1 = require("../../../helpers/Constraints");
const helpers_1 = require("../../../helpers");
const Constants_1 = require("../Constants");
exports.DefaultEnumKeyConstraints = {
    NO_SPECIAL_CHAR: (value) => {
        //Exclude '_', '$' because they are allowed as enum keys
        return helpers_1.FormatHelpers.replaceSpecialCharacters(value, {
            exclude: ['_', '$'],
            separator: '_'
        });
    },
    NO_NUMBER_START_CHAR: Constraints_1.NO_NUMBER_START_CHAR,
    NO_DUPLICATE_KEYS: Constraints_1.NO_DUPLICATE_ENUM_KEYS,
    NO_EMPTY_VALUE: Constraints_1.NO_EMPTY_VALUE,
    NAMING_FORMATTER: helpers_1.FormatHelpers.toConstantCase,
    NO_RESERVED_KEYWORDS: (value) => {
        return (0, Constraints_1.NO_RESERVED_KEYWORDS)(value, (value) => {
            // We don't care about comparing values in lowercase as we are using constant case
            // This means the reserved keywords technically never clashes
            return (0, Constants_1.isReservedCSharpKeyword)(value, false);
        });
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
        let normalizedEnumValue;
        switch (typeof enumValue) {
            case 'boolean':
            case 'bigint':
            case 'number': {
                normalizedEnumValue = enumValue;
                break;
            }
            case 'object': {
                normalizedEnumValue = `"${JSON.stringify(enumValue).replace(/"/g, '\\"')}"`;
                break;
            }
            default: {
                normalizedEnumValue = `"${enumValue}"`;
            }
        }
        return normalizedEnumValue;
    };
}
exports.defaultEnumValueConstraints = defaultEnumValueConstraints;
//# sourceMappingURL=EnumConstrainer.js.map