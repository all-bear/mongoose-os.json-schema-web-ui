import "./index.scss";
import { initialize as initializeJSONEditor } from "./json-editor";
import { loadConfig, rpcCall, saveConfig } from "./mongoose-os";
import { setDeepValue, getDeepValue, fetchJSON } from "./utils"

let WebUIConfigModeBehavior = {};

WebUIConfigModeBehavior.config = {
    getSchema(config) {
        return JSON.parse(config.jsonschemawebui.config.schema);
    },
    getDataFromConfig(config) {
        return config;
    },
    getConfigFromData(data) {
        return data;
    }
};

WebUIConfigModeBehavior.customconfig = {
    getSchema(config) {
        return JSON.parse(config.jsonschemawebui.customconfig.schema);
    },
    getMapping(config) {
        return JSON.parse(config.jsonschemawebui.customconfig.mapping);
    },
    async getDataFromConfig(config) {
        const mapping = await this.getMapping(config);
        const data = {};

        for (const dataPath in mapping) {
            const configPath = mapping[dataPath];

            setDeepValue(data, getDeepValue(config, configPath), dataPath)
        }

        return data;
    },
    async getConfigFromData(data, config) {
        const mapping = await this.getMapping(config);
        const newConfig = {};

        for (const dataPath in mapping) {
            const configPath = mapping[dataPath];

            setDeepValue(newConfig, getDeepValue(data, dataPath), configPath)
        }

        return newConfig;
    }
};

WebUIConfigModeBehavior.customconfigByUrl = {
    ...WebUIConfigModeBehavior.customconfig,
    async getFormConfigByUrl(config) {
        const url = config.jsonschemawebui.customconfig.url;

        return await fetchJSON(url, "GET");
    },
    async getSchema(config) {
        return (await this.getFormConfigByUrl(config)).schema;
    },
    async getMapping(config) {
        return (await this.getFormConfigByUrl(config)).mapping;
    }
};

loadConfig().then(async (config) => {
    const modeBehaviorName = config.jsonschemawebui.customconfig.url ? "customconfigByUrl" : (
        config.jsonschemawebui.customconfig.schema !== "{}" ? "customconfig" : "config"
    );
    const modeBehavior = WebUIConfigModeBehavior[modeBehaviorName];

    initializeJSONEditor(await modeBehavior.getSchema(config), await modeBehavior.getDataFromConfig(config), async (data, reboot) => {
        try {
            await saveConfig(await modeBehavior.getConfigFromData(data, config), reboot);

            alert("Success");

            if (reboot) {
                window.location.reload();
            }
        } catch (e) {
            alert("Something goes wrong")
        }
    }, async (name, params) => {
        try {
            await rpcCall("POST", name, params);

            alert("Success");
        } catch (e) {
            alert("Something goes wrong")
        }
    });
});
