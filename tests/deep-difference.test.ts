import { deepDiff } from '../src';

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
        e: 2,
      },
    },
  };
  const { added, removed, modified } = deepDiff(a, b);

  expect(removed).toHaveLength(3);
  expect(removed[0]).toBe('root[c][d][e][0][f]');
  expect(removed[1]).toBe('root[c][d][e][1][g]');
  expect(removed[2]).toBe('root[c][d][h]');
  expect(added).toHaveLength(1);
  expect(added[0]).toBe('root[c][d][e]');
  expect(modified).toHaveLength(0);
});

test('Ignore case sensitivity', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 'case',
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 'CASE',
        h: 2,
      },
    },
  };
  const { added, removed, modified } = deepDiff(a, b, { caseSensitivity: false });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Exclude keys', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 20,
        h: ['s'],
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 10,
        h: 2,
      },
    },
    f: 10,
  };
  const { added, removed, modified } = deepDiff(a, b, { excludeKeys: ['e', 'h', 'f'] });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Exclude paths', () => {
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
        h: 2,
      },
    },
  };

  const { added, removed, modified } = deepDiff(a, b, { excludePaths: ['root[c][d][e]'] });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Number precision', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2.1,
        h: 2.1,
      },
    },
  };

  const { added, removed, modified } = deepDiff(a, b, { numberPrecision: 0.2 });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Array', () => {
  const a = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const b = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const { added, removed, modified } = deepDiff(a, b);

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Array different order', () => {
  const a = [['test'], {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const b = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }, ['test']];

  const { added, removed, modified } = deepDiff(a, b, { ignoreOrder: true });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Array different order with change', () => {
  const a = [['test'], {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const b = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 5,
        i: 2,
      },
    },
  }, ['test', 'test2']];

  const { added, removed, modified } = deepDiff(a, b, { ignoreOrder: true });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(2);
  expect(added[0]).toBe('root[0][c][d][i]');
  expect(added[1]).toBe('root[1][1]');
  expect(modified).toHaveLength(1);
  expect(modified[0]).toBe('root[0][c][d][h]');
});

test('Array different order with remove', () => {
  const a = [['test'], {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const b = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const { added, removed, modified } = deepDiff(a, b, { ignoreOrder: true });

  expect(removed).toHaveLength(1);
  expect(removed[0]).toBe('root[0][0]');
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});

test('Object nested different order', () => {
  const a = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [{ i: 'df' }],
        h: 2,
      },
    },
  };

  const b = {
    a: 1,
    b: 2,
    c: {
      d: {
        e: [{ j: 5 }, { i: 'df' }],
        h: 2,
      },
    },
  };

  const { added, removed, modified } = deepDiff(a, b, { ignoreOrder: true });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(1);
  expect(added[0]).toBe('root[c][d][e][0][j]');
  expect(modified).toHaveLength(0);
});

test('Array exclude Keys', () => {
  const a = [['test'], {
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
      },
    },
  }];

  const b = [{
    a: 1,
    b: 2,
    c: {
      d: {
        e: 2,
        h: 2,
        i: null,
      },
    },
  }, ['test']];

  const { added, removed, modified } = deepDiff(a, b, { ignoreOrder: true, excludeValues: [null] });

  expect(removed).toHaveLength(0);
  expect(added).toHaveLength(0);
  expect(modified).toHaveLength(0);
});
