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

export const fetchJSON = (url, method, data) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
        } else {
            let message = "";

            try {
                message = JSON.parse(xhr.response).message;
            } catch (e) {
                // NOP
            }

            reject({
                status: xhr.status,
                statusText: xhr.statusText,
                message
            });
        }
    };

    xhr.onerror = function () {
        let message = "";

        try {
            message = JSON.parse(xhr.response).message;
        } catch (e) {
            // NOP
        }

        reject({
            status: xhr.status,
            statusText: xhr.statusText,
            message,
        });
    };

    xhr.open(method, url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data ? JSON.stringify(data) : undefined);
})