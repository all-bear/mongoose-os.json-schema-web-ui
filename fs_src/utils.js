export const setDeepValue = (obj, value, path) => {
    const pathChunks = path.split('.');
    let i = 0;

    for (; i < pathChunks.length - 1; i++) {
        if (!obj[pathChunks[i]]) {
            obj[pathChunks[i]] = {};
        }
        obj = obj[pathChunks[i]];
    }

    obj[pathChunks[i]] = value;
}

export const getDeepValue = (obj, path) => {
    const pathChunks = path.split('.');
    for (let i = 0; i < pathChunks.length; i++) {
        obj = obj[pathChunks[i]];

        if (typeof obj === 'undefined') {
            return "";
        }
    }

    return obj;
}