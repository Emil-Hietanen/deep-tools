import { lowerCase, isEqual } from 'lodash';

import { getLastKey } from '.';

export type Options = {
  excludeKeys?: string[]
  excludePaths?: string[]
  excludeValues? : any[]
  ignoreOrder?: boolean
  caseSensitivity?: boolean
  numberPrecision?: number
}

export class Cmp {
  private excludeKeys: Options['excludeKeys'];

  private excludePaths: Options['excludePaths'];

  private ignoreOrder: Options['ignoreOrder'];

  private caseSensitivity: Options['caseSensitivity'];

  private numberPrecision: Options['numberPrecision'];

  private excludeValues: Options['excludeValues'];

  constructor({
    excludeKeys,
    excludePaths,
    ignoreOrder,
    caseSensitivity,
    numberPrecision,
    excludeValues,
  }: Options) {
    this.excludeKeys = excludeKeys;
    this.excludePaths = excludePaths;
    this.ignoreOrder = ignoreOrder;
    this.caseSensitivity = caseSensitivity;
    this.numberPrecision = numberPrecision;
    this.excludeValues = excludeValues;
  }

  shouldExclude(path: string, value: any) {
    return this.shouldExcludePath(path) || this.shouldExcludeValue(value);
  }

  shouldExcludePath(path: string) {
    if (this.excludePaths?.some((exclPath) => path.includes(exclPath))) { return true; }

    if (this.excludeKeys?.some((exclKey) => path.includes(`[${exclKey}]`))) { return true; }

    return false;
  }

  shouldExcludeValue(value: any) {
    if (this.excludeValues?.some((exclValue) => isEqual(exclValue, value))) { return true; }

    return false;
  }

  private match(a: any, b: any) {
    if (typeof a !== typeof b) return false;
    if (typeof a === 'string') {
      if (!this.caseSensitivity) {
        return lowerCase(a) === lowerCase(b);
      }
    }
    if (typeof b === 'number') {
      if (this.numberPrecision) {
        return Math.abs(a - b) < this.numberPrecision;
      }
    }
    return isEqual(a, b);
  }

  public difference(a: Map<string, any>, b: Map<string, any>) {
    const aEntries = Array.from(a.entries());
    const bEntries = Array.from(b.entries());

    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];

    if (!this.ignoreOrder) {
      bEntries.forEach(([path, value]) => {
        if (!this.shouldExclude(path, value)) {
          if (!a.has(path)) {
            added.push(path);
          } else if (!this.match(value, a.get(path))) {
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
    } else {
      bEntries.forEach(([path, value]) => {
        if (!this.shouldExclude(path, value)) {
          const lastKey = getLastKey(path);

          const matches: string[] = [];
          const nonMatches: [string, number][] = [];

          let index = 0;
          aEntries.forEach(([possiblePath, possibleValue]) => {
            const lastPossibleKey = getLastKey(possiblePath);
            if (this.match(value, possibleValue) && lastKey === lastPossibleKey) {
              matches.push(possiblePath);
              aEntries.splice(index, 1);
            } else {
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
          } else if (matches.length === 0) {
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

  public equality(a: Map<string, any>, b: Map<string, any>) {
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
        const lastKey = getLastKey(path);

        const matches: string[] = [];
        const nonMatches: string[] = [];

        return aEntries.every(([possiblePath, possibleValue], index) => {
          if (!this.shouldExclude(possiblePath, possibleValue)) {
            const lastPossibleKey = getLastKey(possiblePath);
            if (this.match(value, possibleValue) && lastKey === lastPossibleKey) {
              matches.push(possiblePath);
              aEntries.splice(index, 1);
            } else {
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
