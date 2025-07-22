"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPropertyKeyConstraints = exports.DefaultPropertyKeyConstraints = void 0;
const Constraints_1 = require("../../../helpers/Constraints");
const helpers_1 = require("../../../helpers");
const Constants_1 = require("../Constants");
exports.DefaultPropertyKeyConstraints = {
    NO_SPECIAL_CHAR: (value) => {
        //Exclude ` ` and `_` because it gets formatted by NAMING_FORMATTER
        return helpers_1.FormatHelpers.replaceSpecialCharacters(value, {
            exclude: [' ', '_'],
            separator: '_'
        });
    },
    NO_NUMBER_START_CHAR: Constraints_1.NO_NUMBER_START_CHAR,
    NO_DUPLICATE_PROPERTIES: Constraints_1.NO_DUPLICATE_PROPERTIES,
    NO_EMPTY_VALUE: Constraints_1.NO_EMPTY_VALUE,
    NAMING_FORMATTER: helpers_1.FormatHelpers.toCamelCase,
    NO_RESERVED_KEYWORDS: (value) => {
        return (0, Constraints_1.NO_RESERVED_KEYWORDS)(value, Constants_1.isReservedCSharpKeyword);
    },
    NO_ENCLOSING_NAMES: (constrainedObjectModel, value) => {
        if (constrainedObjectModel.name.toLowerCase() === value.toLowerCase()) {
            return `reserved_${value}`;
        }
        return value;
    }
};
function defaultPropertyKeyConstraints(customConstraints) {
    const constraints = Object.assign(Object.assign({}, exports.DefaultPropertyKeyConstraints), customConstraints);
    return ({ objectPropertyModel, constrainedObjectModel, objectModel }) => {
        let constrainedPropertyKey = objectPropertyModel.propertyName;
        constrainedPropertyKey = constraints.NO_SPECIAL_CHAR(constrainedPropertyKey);
        constrainedPropertyKey = constraints.NO_NUMBER_START_CHAR(constrainedPropertyKey);
        constrainedPropertyKey = constraints.NO_EMPTY_VALUE(constrainedPropertyKey);
        constrainedPropertyKey = constraints.NO_RESERVED_KEYWORDS(constrainedPropertyKey);
        constrainedPropertyKey = constraints.NAMING_FORMATTER(constrainedPropertyKey);
        constrainedPropertyKey = constraints.NO_ENCLOSING_NAMES(constrainedObjectModel, constrainedPropertyKey);
        //If the property name has been manipulated, lets make sure it don't clash with existing properties
        if (constrainedPropertyKey !== objectPropertyModel.propertyName) {
            constrainedPropertyKey = constraints.NO_DUPLICATE_PROPERTIES(constrainedObjectModel, objectModel, constrainedPropertyKey, constraints.NAMING_FORMATTER);
        }
        constrainedPropertyKey = constraints.NAMING_FORMATTER(constrainedPropertyKey);
        return constrainedPropertyKey;
    };
}
exports.defaultPropertyKeyConstraints = defaultPropertyKeyConstraints;
//# sourceMappingURL=PropertyKeyConstrainer.js.map