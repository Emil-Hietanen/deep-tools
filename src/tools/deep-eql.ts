import { Cmp, convert, Options } from './helpers';

type InputFormat = Object | Array<any>

const deepEql = (
  a: InputFormat,
  b: InputFormat,
  {
    excludeKeys = [],
    excludePaths = [],
    excludeValues = [],
    ignoreOrder = false,
    caseSensitivity = true,
    numberPrecision = undefined,
  } : Options = {
    excludeKeys: [],
    excludePaths: [],
    excludeValues: [],
    ignoreOrder: false,
    caseSensitivity: true,
    numberPrecision: undefined,
  },
) => {
  const cmp = new Cmp({
    excludeKeys,
    excludePaths,
    excludeValues,
    ignoreOrder,
    caseSensitivity,
    numberPrecision,
  });

  return cmp.equality(convert(a), convert(b));
};

export { deepEql };
