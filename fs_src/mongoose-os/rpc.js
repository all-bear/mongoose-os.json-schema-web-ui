import { fetchJSON } from "../utils"

export const rpcCall = (type, rpc, data) => {
    return fetchJSON("/rpc/" + rpc, type, data);
}