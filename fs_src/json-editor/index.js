const { JSONEditor } = require("@json-editor/json-editor");

export const initialize = (schema, startval, onSubmit, onRPC) => {
    // TODO not the best idea to initialize callbacks because they become global
    JSONEditor.defaults.callbacks = {
        "button": {
            "rpc-call": (editor) => {
                const rpc = editor.options.button["rpc-call"];

                onRPC(rpc.name, rpc.params);
            },
            "save-config": (editor) => {
                onSubmit(editor.jsoneditor.getValue(), editor.options.button["save-config"].reboot);
            },
        }
    }

    return new JSONEditor(document.getElementById("root"), {
        theme: "bootstrap4",
        disable_edit_json: true,
        disable_properties: true,
        disable_collapse: true,
        no_additional_properties: true,
        schema,
        startval,
    });
}