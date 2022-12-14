"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cmp = void 0;
const lodash_1 = require("lodash");
const _1 = require(".");
class Cmp {
    constructor({ excludeKeys, excludePaths, ignoreOrder, caseSensitivity, numberPrecision, excludeValues, }) {
        this.excludeKeys = excludeKeys;
        this.excludePaths = excludePaths;
        this.ignoreOrder = ignoreOrder;
        this.caseSensitivity = caseSensitivity;
        this.numberPrecision = numberPrecision;
        this.excludeValues = excludeValues;
    }
    shouldExclude(path, value) {
        return this.shouldExcludePath(path) || this.shouldExcludeValue(value);
    }
    shouldExcludePath(path) {
        var _a, _b;
        if ((_a = this.excludePaths) === null || _a === void 0 ? void 0 : _a.some((exclPath) => path.includes(exclPath))) {
            return true;
        }
        if ((_b = this.excludeKeys) === null || _b === void 0 ? void 0 : _b.some((exclKey) => path.includes(`[${exclKey}]`))) {
            return true;
        }
        return false;
    }
    shouldExcludeValue(value) {
        var _a;
        if ((_a = this.excludeValues) === null || _a === void 0 ? void 0 : _a.some((exclValue) => (0, lodash_1.isEqual)(exclValue, value))) {
            return true;
        }
        return false;
    }
    match(a, b) {
        if (typeof a !== typeof b)
            return false;
        if (typeof a === 'string') {
            if (!this.caseSensitivity) {
                return (0, lodash_1.lowerCase)(a) === (0, lodash_1.lowerCase)(b);
            }
        }
        if (typeof b === 'number') {
            if (this.numberPrecision) {
                return Math.abs(a - b) < this.numberPrecision;
            }
        }
        return (0, lodash_1.isEqual)(a, b);
    }
    difference(a, b) {
        const aEntries = Array.from(a.entries());
        const bEntries = Array.from(b.entries());
        const added = [];
        const removed = [];
        const modified = [];
        if (!this.ignoreOrder) {
            bEntries.forEach(([path, value]) => {
                if (!this.shouldExclude(path, value)) {
                    if (!a.has(path)) {
                        added.push(path);
                    }
                    else if (!this.match(value, a.get(path))) {
                        modified.push(path);
                    }
                }
            });
            aEntries.forEach(([path, value]) => {
                if (!this.shouldExclude(path, value)) {
                    const isAlreadyModified = modified.some((item) => path.includes(item));
                    if (!b.has(path) && !isAlreadyModified) {
                        removed.push(path);
                    }
                }
            });
        }
        else {
            bEntries.forEach(([path, value]) => {
                if (!this.shouldExclude(path, value)) {
                    const lastKey = (0, _1.getLastKey)(path);
                    const matches = [];
                    const nonMatches = [];
                    let index = 0;
                    aEntries.forEach(([possiblePath, possibleValue]) => {
                        const lastPossibleKey = (0, _1.getLastKey)(possiblePath);
                        if (this.match(value, possibleValue) && lastKey === lastPossibleKey) {
                            matches.push(possiblePath);
                            aEntries.splice(index, 1);
                        }
                        else {
                            nonMatches.push([lastPossibleKey, index]);
                        }
                        index = +1;
                    });
                    const isModified = nonMatches.some(([key, indx]) => {
                        if (key === lastKey) {
                            aEntries.splice(indx, 1);
                            return true;
                        }
                        return false;
                    });
                    if (isModified) {
                        modified.push(path);
                    }
                    else if (matches.length === 0) {
                        added.push(path);
                    }
                }
            });
            aEntries.forEach(([path]) => {
                if (!b.has(path)) {
                    removed.push(path);
                }
            });
        }
        return { added, removed, modified };
    }
    equality(a, b) {
        const aEntries = Array.from(a.entries());
        const bEntries = Array.from(b.entries());
        if (!this.ignoreOrder) {
            if (bEntries.some(([path, value]) => {
                if (!this.shouldExclude(path, value)) {
                    if (!a.has(path) || !this.match(value, a.get(path))) {
                        return true;
                    }
                }
                return false;
            })) {
                return false;
            }
            return aEntries.every(([path, value]) => {
                if (!this.shouldExclude(path, value)) {
                    if (!b.has(path)) {
                        return false;
                    }
                }
                return true;
            });
        }
        return bEntries.every(([path, value]) => {
            if (!this.shouldExclude(path, value)) {
                const lastKey = (0, _1.getLastKey)(path);
                const matches = [];
                const nonMatches = [];
                return aEntries.every(([possiblePath, possibleValue], index) => {
                    if (!this.shouldExclude(possiblePath, possibleValue)) {
                        const lastPossibleKey = (0, _1.getLastKey)(possiblePath);
                        if (this.match(value, possibleValue) && lastKey === lastPossibleKey) {
                            matches.push(possiblePath);
                            aEntries.splice(index, 1);
                        }
                        else {
                            nonMatches.push(lastPossibleKey);
                        }
                    }
                    return nonMatches.every((key) => {
                        if (key === lastKey) {
                            return false;
                        }
                        return true;
                    });
                });
            }
            return true;
        });
    }
}
exports.Cmp = Cmp;
