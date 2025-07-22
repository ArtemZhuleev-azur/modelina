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
    NAMING_FORMATTER: helpers_1.FormatHelpers.toPascalCase,
    NO_RESERVED_KEYWORDS: (value) => {
        return (0, Constraints_1.NO_RESERVED_KEYWORDS)(value, Constants_1.isReservedGoKeyword);
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
            //Must check against the enum key with the constrained enum model name
            constrainedEnumKey = constraints.NO_DUPLICATE_KEYS(constrainedEnumModel, enumModel, constrainedEnumKey, constraints.NAMING_FORMATTER, `${constrainedEnumModel.name}_${constrainedEnumKey}`, () => {
                return `reserved_${constrainedEnumKey}`;
            }, () => {
                return `${constrainedEnumModel.name}_reserved_${constrainedEnumKey}`;
            });
        }
        constrainedEnumKey = `${constrainedEnumModel.name}_${constrainedEnumKey}`;
        constrainedEnumKey = constraints.NAMING_FORMATTER(constrainedEnumKey);
        return constrainedEnumKey;
    };
}
exports.defaultEnumKeyConstraints = defaultEnumKeyConstraints;
function defaultEnumValueConstraints() {
    return ({ enumValue }) => {
        let constrainedEnumValue = JSON.stringify(enumValue);
        switch (typeof enumValue) {
            case 'string':
                constrainedEnumValue = `"${enumValue}"`;
                break;
            case 'number':
            case 'bigint':
                constrainedEnumValue = enumValue;
                break;
        }
        return constrainedEnumValue;
    };
}
exports.defaultEnumValueConstraints = defaultEnumValueConstraints;
//# sourceMappingURL=EnumConstrainer.js.map