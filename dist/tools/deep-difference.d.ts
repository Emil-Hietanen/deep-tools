import { Options } from './helpers';
type InputFormat = Object | Array<any>;
declare const deepDiff: (a: InputFormat, b: InputFormat, { excludeKeys, excludePaths, excludeValues, ignoreOrder, caseSensitivity, numberPrecision, }?: Options) => {
    added: string[];
    removed: string[];
    modified: string[];
};
export { deepDiff };
