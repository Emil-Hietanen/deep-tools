"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepEql = void 0;
const helpers_1 = require("./helpers");
const deepEql = (a, b, { excludeKeys = [], excludePaths = [], excludeValues = [], ignoreOrder = false, caseSensitivity = true, numberPrecision = undefined, } = {
    excludeKeys: [],
    excludePaths: [],
    excludeValues: [],
    ignoreOrder: false,
    caseSensitivity: true,
    numberPrecision: undefined,
}) => {
    const cmp = new helpers_1.Cmp({
        excludeKeys,
        excludePaths,
        excludeValues,
        ignoreOrder,
        caseSensitivity,
        numberPrecision,
    });
    return cmp.equality((0, helpers_1.convert)(a), (0, helpers_1.convert)(b));
};
exports.deepEql = deepEql;
