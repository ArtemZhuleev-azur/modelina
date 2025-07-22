"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryModel = exports.EnumModel = exports.EnumValueModel = exports.UnionModel = exports.ArrayModel = exports.ObjectModel = exports.ObjectPropertyModel = exports.TupleModel = exports.TupleValueModel = exports.BooleanModel = exports.StringModel = exports.IntegerModel = exports.FloatModel = exports.AnyModel = exports.ReferenceModel = exports.MetaModel = exports.MetaModelOptions = void 0;
class MetaModelOptions {
    constructor() {
        this.isNullable = false;
    }
}
exports.MetaModelOptions = MetaModelOptions;
class MetaModel {
    constructor(name, originalInput, options) {
        this.name = name;
        this.originalInput = originalInput;
        this.options = options;
    }
}
exports.MetaModel = MetaModel;
class ReferenceModel extends MetaModel {
    constructor(name, originalInput, options, ref) {
        super(name, originalInput, options);
        this.ref = ref;
    }
}
exports.ReferenceModel = ReferenceModel;
class AnyModel extends MetaModel {
}
exports.AnyModel = AnyModel;
class FloatModel extends MetaModel {
}
exports.FloatModel = FloatModel;
class IntegerModel extends MetaModel {
}
exports.IntegerModel = IntegerModel;
class StringModel extends MetaModel {
}
exports.StringModel = StringModel;
class BooleanModel extends MetaModel {
}
exports.BooleanModel = BooleanModel;
class TupleValueModel {
    constructor(index, value) {
        this.index = index;
        this.value = value;
    }
}
exports.TupleValueModel = TupleValueModel;
class TupleModel extends MetaModel {
    constructor(name, originalInput, options, tuple) {
        super(name, originalInput, options);
        this.tuple = tuple;
    }
}
exports.TupleModel = TupleModel;
class ObjectPropertyModel {
    constructor(propertyName, required, property) {
        this.propertyName = propertyName;
        this.required = required;
        this.property = property;
    }
}
exports.ObjectPropertyModel = ObjectPropertyModel;
class ObjectModel extends MetaModel {
    constructor(name, originalInput, options, properties) {
        super(name, originalInput, options);
        this.properties = properties;
    }
}
exports.ObjectModel = ObjectModel;
class ArrayModel extends MetaModel {
    constructor(name, originalInput, options, valueModel) {
        super(name, originalInput, options);
        this.valueModel = valueModel;
    }
}
exports.ArrayModel = ArrayModel;
class UnionModel extends MetaModel {
    constructor(name, originalInput, options, union) {
        super(name, originalInput, options);
        this.union = union;
    }
}
exports.UnionModel = UnionModel;
class EnumValueModel {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.EnumValueModel = EnumValueModel;
class EnumModel extends MetaModel {
    constructor(name, originalInput, options, values) {
        super(name, originalInput, options);
        this.values = values;
    }
}
exports.EnumModel = EnumModel;
class DictionaryModel extends MetaModel {
    constructor(name, originalInput, options, key, value, serializationType = 'normal') {
        super(name, originalInput, options);
        this.key = key;
        this.value = value;
        this.serializationType = serializationType;
    }
}
exports.DictionaryModel = DictionaryModel;
//# sourceMappingURL=MetaModel.js.map