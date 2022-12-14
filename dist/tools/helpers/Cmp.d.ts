export type Options = {
    excludeKeys?: string[];
    excludePaths?: string[];
    excludeValues?: any[];
    ignoreOrder?: boolean;
    caseSensitivity?: boolean;
    numberPrecision?: number;
};
export declare class Cmp {
    private excludeKeys;
    private excludePaths;
    private ignoreOrder;
    private caseSensitivity;
    private numberPrecision;
    private excludeValues;
    constructor({ excludeKeys, excludePaths, ignoreOrder, caseSensitivity, numberPrecision, excludeValues, }: Options);
    shouldExclude(path: string, value: any): boolean;
    shouldExcludePath(path: string): boolean;
    shouldExcludeValue(value: any): boolean;
    private match;
    difference(a: Map<string, any>, b: Map<string, any>): {
        added: string[];
        removed: string[];
        modified: string[];
    };
    equality(a: Map<string, any>, b: Map<string, any>): boolean;
}
