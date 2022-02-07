const express = require("express");
const path = require("path");
const deepmerge = require("deepmerge");
const app = express();
const PORT = 3000;
const folder = path.resolve(__dirname, "../fs");

// TODO move to some file or env
const JSONSCHEMA_WEB_UI_CONFIG_MODE_CONFIG = {
    config: {
        schema: `{
            "title": "My Device",
            "type": "object",
            "properties": {
                "wifi": {
                    "title": "Wifi",
                    "type": "object",
                    "properties": {
                        "sta": {
                            "title": "STA",
                            "type": "object",
                            "properties": {
                                "ssid": {
                                    "type": "string",
                                    "title": "SSID"
                                },
                                "password": {
                                    "type": "string",
                                    "title": "Password"
                                }
                            }
                        }
                    }
                },
                "submit": {
                    "type": "button",
                    "title": "Save and reboot",
                    "options": {
                        "button": {
                            "action": "save-config",
                            "save-config": {
                                "reboot": true
                            }
                        }
                    }
                }
            }
        }`
    }
};

const JSONSCHEMA_WEB_UI_CONFIG_MODE_CUSTOM = {
    customconfig: {
        schema: `{
            "title": "My Device",
            "type": "object",
            "properties": {
                "wifi-group": {
                    "type": "object",
                    "format": "grid",
                    "title": "Wifi",
                    "properties": {
                        "ssid": {
                            "type": "string",
                            "title": "SSID"
                        },
                        "password": {
                            "type": "string",
                            "title": "Password"
                        }
                    }
                },
                "submit": {
                    "type": "button",
                    "title": "Save and reboot",
                    "options": {
                        "button": {
                            "action": "save-config",
                            "save-config": {
                                "reboot": true
                            }
                        }
                    }
                }
            }
        }`,
        mapping: {
            "wifi-group.ssid": "wifi.sta.ssid",
            "wifi-group.password": "wifi.sta.password"
        }
    }
};

const JSONSCHEMA_WEB_UI_CONFIG_MODE_CONFIG_WITH_RPC = {
    config: {
        schema: `{
            "title": "My Device",
            "type": "object",
            "required": ["rpc-call-group"],
            "properties": {
                "rpc1": {
                    "type": "button",
                    "title": "My RPC 1",
                    "options": {
                        "button": {
                            "action": "rpc-call",
                            "rpc-call": {
                                "name": "RPC_NAME1"
                            }
                        }
                    }
                },
                "rpc-call-group": {
                    "type": "object",
                    "title": "RPC group",
                    "format": "grid",
                    "properties": {
                        "rpc2": {
                            "type": "button",
                            "title": "My RPC 2",
                            "options": {
                                "button": {
                                    "action": "rpc-call",
                                    "rpc-call": {
                                        "name": "RPC_NAME2",
                                        "params": {
                                            "some-param": "some-value"
                                        }
                                    }
                                }
                            }
                        },
                        "rpc3": {
                            "type": "button",
                            "title": "My RPC 3",
                            "options": {
                                "button": {
                                    "action": "rpc-call",
                                    "rpc-call": {
                                        "name": "RPC_NAME3"
                                    }
                                }
                            }
                        }
                    }
                },
                "submit": {
                    "type": "button",
                    "title": "Save and reboot",
                    "options": {
                        "button": {
                            "action": "save-config",
                            "save-config": {
                                "reboot": true
                            }
                        }
                    }
                }
            }
        }`
    }
}

let MongooseOSConfig = {
    wifi: {
        sta: {
            ssid: "Dummy STA SSID",
            password: "",
        }
    },
    jsonschemawebui: JSONSCHEMA_WEB_UI_CONFIG_MODE_CONFIG_WITH_RPC,
}

app.use("/", express.static(folder, {
    setHeaders: (res, path) => {
        if (/\.gz$/.test(path)) {
            res.setHeader("Content-Encoding", "gzip");
        }
    }
}));
app.use(express.json());

app.post("/rpc/*", (req, res) => {
    return res.json(true);
});

app.get("/rpc/Config.Get", (req, res) => {
    return res.json(MongooseOSConfig);
});

app.post("/rpc/Config.Set", (req, res) => {
    MongooseOSConfig = deepmerge(MongooseOSConfig, req.body.config);

    return res.json(true);
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));