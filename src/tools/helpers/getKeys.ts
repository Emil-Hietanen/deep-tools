export const getAllKeys = (path: string) => path.split(/\[(.*?)\]/gm).filter(((item) => !['root', ''].includes(item)));

export const getLastKey = (path: string) => getAllKeys(path).reverse()[0];
