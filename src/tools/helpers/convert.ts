import { isObject } from 'lodash';

export const convert = (_input: object, dir = 'root') => {
  const entries: [string, any][] = [];

  Object.entries(_input).forEach(([key, value]) => {
    if (isObject(value)) {
      entries.push(...convert(value, `${dir}[${key}]`));
    } else {
      entries.push([`${dir}[${key}]`, value]);
    }
  });

  return new Map(entries);
};
