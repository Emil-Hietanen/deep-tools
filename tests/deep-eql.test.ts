import { deepEql } from '../src';

test('Default parameters with difference', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 4 },
        ],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
      },
    },
  };
  expect(deepEql(a, b)).toBe(false);
});

test('Default parameters', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 4 },
        ],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 4 },
        ],
        h: 2,
      },
    },
  };
  expect(deepEql(a, b)).toBe(true);
});

test('Different order', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 4 },
        ],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { g: 4 }, { f: 3 },
        ],
        h: 2,
      },
    },
  };
  expect(deepEql(a, b, { ignoreOrder: true })).toBe(true);
});

test('Different order and change', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 4 },
        ],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { g: 'test' }, { f: 3 },
        ],
        h: 2,
      },
    },
  };
  expect(deepEql(a, b, { ignoreOrder: true })).toBe(false);
});

test('Different order and no case sensitivity', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 'TEST' },
        ],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { g: 'test' }, { f: 3 },
        ],
        h: 2,
      },
    },
  };
  expect(deepEql(a, b, { ignoreOrder: true, caseSensitivity: false })).toBe(true);
});

test('Different order and exclude keys', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 2 },
        ],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { g: 10 }, { f: 3 },
        ],
        h: 2,
      },
    },
  };
  expect(deepEql(a, b, { ignoreOrder: true, excludeKeys: ['g'] })).toBe(true);
});

test('Different order', () => {
  const a = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 10 },
        ],
        h: 2,
      },
    },
  }, 'Test'];

  const b = ['Test', {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { g: 10 }, { f: 3 },
        ],
        h: 2,
      },
    },
  }];
  expect(deepEql(a, b, { ignoreOrder: true })).toBe(true);
});

test('Complex nested list of objects', () => {
  const a = [
    {
      a: 1,
      b: 2,
      c: {
        d: {
          e: [
            { f: 3 }, { g: 10 },
          ],
          h: 2,
        },
      },
    }, {
      j: {
        k: [{ l: 1 }],
      },
      m: {
        n: 'test',
        o: {
          p: {
            q: [{ r: 1 }, { v: 2 }],
          },
        },
      },
    }];

  const b = [
    {
      j: {
        k: [{ l: 1 }],
      },
      m: {
        n: 'Test',
        o: {
          p: {
            q: [{ v: 2 }, { r: 1.005 }],
          },
        },
      },
    },
    {
      a: 1,
      b: 2,
      c: {
        d: {
          e: [
            { f: 3.1 }, { g: 10 },
          ],
          h: 2.1,
        },
      },
    }];
  expect(deepEql(
    a,
    b,
    { ignoreOrder: true, caseSensitivity: false, numberPrecision: 0.2 },
  )).toBe(true);
});

test('Exclude values', () => {
  const a = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 10 },
        ],
        h: 2,
      },
    },
  }, 'Test'];

  const b = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: [
          { f: 3 }, { g: 10 },
        ],
        h: 2,
        i: null,
        k: '',
        l: undefined,
      },
    },
  }, 'Test'];

  expect(deepEql(a, b, { excludeValues: [null, '', undefined] })).toBe(true);
});
