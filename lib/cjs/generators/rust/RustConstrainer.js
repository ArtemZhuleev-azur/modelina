"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustDefaultConstraints = exports.RustDefaultTypeMapping = exports.allCopyable = exports.allHashable = exports.allOrd = exports.allPartialOrd = exports.allEq = exports.allPartialEq = exports.deriveOrd = exports.derivePartialOrd = exports.deriveEq = exports.derivePartialEq = exports.deriveCopy = exports.deriveHash = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
const helpers_1 = require("../../helpers");
const models_1 = require("../../models");
const ConstantConstrainer_1 = require("./constrainer/ConstantConstrainer");
function deriveHash(model) {
    // float primitives and std::collection::HashMap do not implement Hash trait
    if (model instanceof models_1.ConstrainedDictionaryModel ||
        model instanceof models_1.ConstrainedFloatModel ||
        model instanceof models_1.ConstrainedAnyModel) {
        return false;
    }
    else if (
    // all contents implement Hash trait
    model instanceof models_1.ConstrainedUnionModel ||
        model instanceof models_1.ConstrainedTupleModel ||
        model instanceof models_1.ConstrainedEnumModel ||
        model instanceof models_1.ConstrainedArrayModel ||
        model instanceof models_1.ConstrainedObjectModel) {
        return allHashable(model);
    }
    return true;
}
exports.deriveHash = deriveHash;
function deriveCopy(model) {
    if (
    // serde_json::Value, HashMap, Box, and String do not implement copy
    model instanceof models_1.ConstrainedAnyModel ||
        model instanceof models_1.ConstrainedDictionaryModel ||
        model instanceof models_1.ConstrainedReferenceModel ||
        model instanceof models_1.ConstrainedStringModel) {
        return false;
    }
    else if (
    // all contents implement Copy trait
    model instanceof models_1.ConstrainedArrayModel ||
        model instanceof models_1.ConstrainedEnumModel ||
        model instanceof models_1.ConstrainedObjectModel ||
        model instanceof models_1.ConstrainedTupleModel ||
        model instanceof models_1.ConstrainedUnionModel) {
        return allCopyable(model);
    }
    return true;
}
exports.deriveCopy = deriveCopy;
function derivePartialEq(model) {
    if (model instanceof models_1.ConstrainedAnyModel) {
        return false;
    }
    if (
    // all contents implement PartialEq trait
    model instanceof models_1.ConstrainedArrayModel ||
        model instanceof models_1.ConstrainedEnumModel ||
        model instanceof models_1.ConstrainedObjectModel ||
        model instanceof models_1.ConstrainedTupleModel ||
        model instanceof models_1.ConstrainedUnionModel ||
        model instanceof models_1.ConstrainedDictionaryModel) {
        return allPartialEq(model);
    }
    return true;
}
exports.derivePartialEq = derivePartialEq;
function deriveEq(model) {
    if (!derivePartialEq(model)) {
        return false;
    }
    if (model instanceof models_1.ConstrainedFloatModel ||
        model instanceof models_1.ConstrainedAnyModel) {
        return false;
    }
    else if (
    // all contents implement Eq trait
    model instanceof models_1.ConstrainedArrayModel ||
        model instanceof models_1.ConstrainedEnumModel ||
        model instanceof models_1.ConstrainedObjectModel ||
        model instanceof models_1.ConstrainedTupleModel ||
        model instanceof models_1.ConstrainedUnionModel ||
        model instanceof models_1.ConstrainedDictionaryModel) {
        return allEq(model);
    }
    return true;
}
exports.deriveEq = deriveEq;
function derivePartialOrd(model) {
    if (model instanceof models_1.ConstrainedAnyModel ||
        model instanceof models_1.ConstrainedDictionaryModel) {
        return false;
    }
    else if (
    // all contents implement PartialOrd trait
    model instanceof models_1.ConstrainedArrayModel ||
        model instanceof models_1.ConstrainedEnumModel ||
        model instanceof models_1.ConstrainedObjectModel ||
        model instanceof models_1.ConstrainedTupleModel ||
        model instanceof models_1.ConstrainedUnionModel) {
        return allPartialOrd(model);
    }
    return true;
}
exports.derivePartialOrd = derivePartialOrd;
function deriveOrd(model) {
    if (!derivePartialOrd(model)) {
        return false;
    }
    if (model instanceof models_1.ConstrainedFloatModel ||
        model instanceof models_1.ConstrainedAnyModel ||
        model instanceof models_1.ConstrainedDictionaryModel) {
        return false;
    }
    else if (
    // all contents implement Ord trait
    model instanceof models_1.ConstrainedArrayModel ||
        model instanceof models_1.ConstrainedEnumModel ||
        model instanceof models_1.ConstrainedObjectModel ||
        model instanceof models_1.ConstrainedTupleModel ||
        model instanceof models_1.ConstrainedUnionModel) {
        return allOrd(model);
    }
    return true;
}
exports.deriveOrd = deriveOrd;
function allPartialEq(model) {
    if (model instanceof models_1.ConstrainedUnionModel) {
        return model.union.map(derivePartialEq).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        return model.tuple
            .map((v) => derivePartialEq(v.value))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedObjectModel) {
        return Object.values(model.properties)
            .map((p) => derivePartialEq(p.property))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        return derivePartialEq(model.valueModel);
    }
    else if (model instanceof models_1.ConstrainedEnumModel) {
        return model.values
            .map((v) => derivePartialEq(v.value))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedDictionaryModel) {
        return derivePartialEq(model.value);
    }
    return false;
}
exports.allPartialEq = allPartialEq;
function allEq(model) {
    if (model instanceof models_1.ConstrainedUnionModel) {
        return model.union.map(deriveEq).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        return model.tuple.map((v) => deriveEq(v.value)).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedObjectModel) {
        return Object.values(model.properties)
            .map((p) => deriveEq(p.property))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        return deriveEq(model.valueModel);
    }
    else if (model instanceof models_1.ConstrainedEnumModel) {
        return model.values.map((v) => deriveEq(v.value)).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedDictionaryModel) {
        return deriveEq(model.value);
    }
    return false;
}
exports.allEq = allEq;
function allPartialOrd(model) {
    if (model instanceof models_1.ConstrainedUnionModel) {
        return model.union.map(derivePartialOrd).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        return model.tuple
            .map((v) => derivePartialOrd(v.value))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedObjectModel) {
        return Object.values(model.properties)
            .map((p) => derivePartialOrd(p.property))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        return derivePartialOrd(model.valueModel);
    }
    else if (model instanceof models_1.ConstrainedEnumModel) {
        return model.values
            .map((v) => derivePartialOrd(v.value))
            .every((v) => v === true);
    }
    return false;
}
exports.allPartialOrd = allPartialOrd;
function allOrd(model) {
    if (model instanceof models_1.ConstrainedUnionModel) {
        return model.union.map(deriveOrd).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        return model.tuple.map((v) => deriveOrd(v.value)).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedObjectModel) {
        return Object.values(model.properties)
            .map((p) => deriveOrd(p.property))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        return deriveOrd(model.valueModel);
    }
    else if (model instanceof models_1.ConstrainedEnumModel) {
        return model.values.map((v) => deriveOrd(v.value)).every((v) => v === true);
    }
    return false;
}
exports.allOrd = allOrd;
function allHashable(model) {
    if (model instanceof models_1.ConstrainedUnionModel) {
        return model.union.map(deriveHash).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        return model.tuple.map((v) => deriveHash(v.value)).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedObjectModel) {
        return Object.values(model.properties)
            .map((p) => deriveHash(p.property))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        return deriveHash(model.valueModel);
    }
    else if (model instanceof models_1.ConstrainedEnumModel) {
        return model.values
            .map((v) => deriveHash(v.value))
            .every((v) => v === true);
    }
    return false;
}
exports.allHashable = allHashable;
function allCopyable(model) {
    if (model instanceof models_1.ConstrainedUnionModel) {
        return model.union.map(deriveCopy).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedTupleModel) {
        return model.tuple.map((v) => deriveCopy(v.value)).every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedObjectModel) {
        return Object.values(model.properties)
            .map((p) => deriveCopy(p.property))
            .every((v) => v === true);
    }
    else if (model instanceof models_1.ConstrainedArrayModel) {
        return deriveCopy(model.valueModel);
    }
    else if (model instanceof models_1.ConstrainedEnumModel) {
        return model.values
            .map((v) => deriveCopy(v.value))
            .every((v) => v === true);
    }
    return false;
}
exports.allCopyable = allCopyable;
exports.RustDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return `${constrainedModel.name}`;
    },
    Any() {
        return 'serde_json::Value';
    },
    Float({ constrainedModel }) {
        switch (constrainedModel.options.format) {
            case 'fp32':
            case 'f32':
            case 'float32':
                return 'f32';
            default:
                return 'f64';
        }
    },
    Integer({ constrainedModel }) {
        switch (constrainedModel.options.format) {
            case 'int8':
            case 'i8':
                return 'i8';
            case 'int16':
            case 'i16':
                return 'i16';
            case 'int32':
            case 'integer':
            case 'i32':
                return 'i32';
            case 'int64':
            case 'long':
            case 'i64':
                return 'i64';
            case 'int128':
            case 'i128':
                return 'i128';
            case 'uint8':
            case 'u8':
                return 'u8';
            case 'uint16':
            case 'u16':
                return 'u16';
            case 'uint32':
            case 'u32':
                return 'u32';
            case 'uint64':
            case 'u64':
                return 'u64';
            case 'uint128':
            case 'u128':
                return 'u128';
            default:
                return 'i32';
        }
    },
    String({ constrainedModel }) {
        switch (constrainedModel.options.format) {
            case 'bytes':
            case 'bytes[]':
            case 'binary':
                return 'Vec<u8>';
            default:
                return 'String';
        }
    },
    Boolean() {
        return 'bool';
    },
    Tuple({ constrainedModel }) {
        return `${constrainedModel.name}`;
    },
    Array({ constrainedModel }) {
        const prefix = constrainedModel.valueModel instanceof models_1.ConstrainedReferenceModel
            ? 'crate::'
            : '';
        return `Vec<${prefix}${helpers_1.FormatHelpers.upperFirst(constrainedModel.valueModel.type)}>`;
    },
    Enum({ constrainedModel }) {
        return constrainedModel.name;
    },
    Union({ constrainedModel }) {
        return constrainedModel.name;
    },
    Dictionary({ constrainedModel }) {
        const key_prefix = constrainedModel.key instanceof models_1.ConstrainedReferenceModel
            ? 'crate::'
            : '';
        const value_prefix = constrainedModel.value instanceof models_1.ConstrainedReferenceModel
            ? 'crate::'
            : '';
        return `std::collections::HashMap<${key_prefix}${constrainedModel.key.type}, ${value_prefix}${constrainedModel.value.type}>`;
    }
};
exports.RustDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)(),
    constant: (0, ConstantConstrainer_1.defaultConstantConstraints)()
};
//# sourceMappingURL=RustConstrainer.js.map