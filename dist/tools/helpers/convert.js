"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convert = void 0;
const lodash_1 = require("lodash");
const convert = (_input, dir = 'root') => {
    const entries = [];
    Object.entries(_input).forEach(([key, value]) => {
        if ((0, lodash_1.isObject)(value)) {
            entries.push(...(0, exports.convert)(value, `${dir}[${key}]`));
        }
        else {
            entries.push([`${dir}[${key}]`, value]);
        }
    });
    return new Map(entries);
};
exports.convert = convert;
