import { rpcCall } from "./rpc";

export const loadConfig = () => rpcCall("GET", "Config.Get");
export const saveConfig = (config, reboot) => rpcCall("POST", "Config.Set", { config: config, save: true, reboot: reboot || false });