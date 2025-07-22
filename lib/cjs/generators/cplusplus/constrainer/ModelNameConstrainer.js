"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultModelNameConstraints = exports.DefaultModelNameConstraints = void 0;
const Constraints_1 = require("../../../helpers/Constraints");
const helpers_1 = require("../../../helpers");
const Constants_1 = require("../Constants");
exports.DefaultModelNameConstraints = {
    NO_SPECIAL_CHAR: (value) => {
        //Exclude ` ` because it gets formatted by NAMING_FORMATTER
        //Exclude '_' because they are allowed
        return helpers_1.FormatHelpers.replaceSpecialCharacters(value, {
            exclude: ['_'],
            separator: '_'
        });
    },
    NO_NUMBER_START_CHAR: Constraints_1.NO_NUMBER_START_CHAR,
    NO_EMPTY_VALUE: Constraints_1.NO_EMPTY_VALUE,
    NAMING_FORMATTER: helpers_1.FormatHelpers.toSnakeCase,
    NO_RESERVED_KEYWORDS: (value) => {
        return (0, Constraints_1.NO_RESERVED_KEYWORDS)(value, Constants_1.isReservedCplusplusKeyword);
    }
};
/**
 * Default constraint logic for Cplusplus, which converts the model name into something that is compatible with Cplusplus
 */
function defaultModelNameConstraints(customConstraints) {
    const constraints = Object.assign(Object.assign({}, exports.DefaultModelNameConstraints), customConstraints);
    return ({ modelName }) => {
        let constrainedValue = modelName;
        constrainedValue = constraints.NO_SPECIAL_CHAR(constrainedValue);
        constrainedValue = constraints.NO_NUMBER_START_CHAR(constrainedValue);
        constrainedValue = constraints.NO_EMPTY_VALUE(constrainedValue);
        constrainedValue = constraints.NO_RESERVED_KEYWORDS(constrainedValue);
        constrainedValue = constraints.NAMING_FORMATTER(constrainedValue);
        return constrainedValue;
    };
}
exports.defaultModelNameConstraints = defaultModelNameConstraints;
//# sourceMappingURL=ModelNameConstrainer.js.map