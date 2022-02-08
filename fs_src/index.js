import "./index.scss";
import { initialize as initializeJSONEditor } from "./json-editor";
import { loadConfig, rpcCall, saveConfig } from "./mongoose-os";
import { setDeepValue, getDeepValue } from "./utils"

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
    }
}

loadConfig().then((config) => {
    const isCustomConfigMode = Boolean(config["jsonschemawebui"].customconfig);
    const modeBehavior = WebUIConfigModeBehavior[isCustomConfigMode ? "customconfig" : "config"];

    initializeJSONEditor(JSON.parse(modeBehavior.getSchema(config)), modeBehavior.getDataFromConfig(config), async (data, reboot) => {
        try {
            await saveConfig(modeBehavior.getConfigFromData(data, config), reboot);

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
