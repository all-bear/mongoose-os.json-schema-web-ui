export const rpcCall = (type, rpc, data) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.response));
        } else {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        }
    };

    xhr.onerror = function () {
        reject({
            status: xhr.status,
            statusText: xhr.statusText
        });
    };

    xhr.open(type, "/rpc/" + rpc );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data ? JSON.stringify(data) : undefined);
})