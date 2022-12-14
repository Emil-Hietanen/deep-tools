"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLastKey = exports.getAllKeys = void 0;
const getAllKeys = (path) => path.split(/\[(.*?)\]/gm).filter(((item) => !['root', ''].includes(item)));
exports.getAllKeys = getAllKeys;
const getLastKey = (path) => (0, exports.getAllKeys)(path).reverse()[0];
exports.getLastKey = getLastKey;
