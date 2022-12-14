import { Options } from './helpers';
type InputFormat = Object | Array<any>;
declare const deepEql: (a: InputFormat, b: InputFormat, { excludeKeys, excludePaths, excludeValues, ignoreOrder, caseSensitivity, numberPrecision, }?: Options) => boolean;
export { deepEql };
