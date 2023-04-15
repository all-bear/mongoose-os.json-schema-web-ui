import "./index.scss";
import { initialize as initializeJSONEditor } from "./json-editor";
import { loadConfig, rpcCall, saveConfig } from "./mongoose-os";
import { setDeepValue, getDeepValue, fetchJSON } from "./utils"

const WebUIConfigModeBehavior = {
    "config": {
        getSchema(config) {
            return config.jsonschemawebui.config.schema;
        },
        getDataFromConfig(config) {
            return config;
        },
        getConfigFromData(data) {
            return data;
        }
    },
    "customconfig": {
        getSchema(config) {
            return config.jsonschemawebui.customconfig.schema;
        },
        getDataFromConfig(config) {
            const mapping = JSON.parse(config.jsonschemawebui.customconfig.mapping);
            const data = {};

            for (const dataPath in mapping) {
                const configPath = mapping[dataPath];

                setDeepValue(data, getDeepValue(config, configPath), dataPath)
            }

            return data;
        },
        getConfigFromData(data, config) {
            const mapping = JSON.parse(config.jsonschemawebui.customconfig.mapping);
            const newConfig = {};

            for (const dataPath in mapping) {
                const configPath = mapping[dataPath];

                setDeepValue(newConfig, getDeepValue(data, dataPath), configPath)
            }

            return newConfig;
        }
    },
    "customconfigByUrl": {
        async getFormConfigByUrl(config) {
            const url = config.jsonschemawebui.customconfig.url;

            return await fetchJSON(url, "GET");
        },
        async getSchema(config) {
            return (await this.getFormConfigByUrl(config)).schema;
        },
        async getMapping(config) {
            return (await this.getFormConfigByUrl(config)).mapping;
        },
        async getDataFromConfig(config) {
            const formConfig = await this.getFormConfigByUrl(config);

            return WebUIConfigModeBehavior["customconfig"].getDataFromConfig({
                ...config,
                jsonschemawebui: {
                    ...config.jsonschemawebui,
                    customconfig: formConfig,
                }
            })
        },
        async getConfigFromData(data, config) {
            const formConfig = await this.getFormConfigByUrl(config);

            return WebUIConfigModeBehavior["customconfig"].getConfigFromData(data,{
                ...config,
                jsonschemawebui: {
                    ...config.jsonschemawebui,
                    customconfig: formConfig,
                }
            })
        }
    }
}

loadConfig().then(async (config) => {
    const modeBehaviorName = config.jsonschemawebui.customconfig.url ? "customconfigByUrl" : (
        config.jsonschemawebui.customconfig.schema !== "{}" ? "customconfig" : "config"
    );
    const modeBehavior = WebUIConfigModeBehavior[modeBehaviorName];

    initializeJSONEditor(JSON.parse(await modeBehavior.getSchema(config)), await modeBehavior.getDataFromConfig(config), async (data, reboot) => {
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
