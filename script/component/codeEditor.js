sap.ui.define(["formatCode", "sap/ui/codeeditor/CodeEditor", "sap/m/Button", "sap/m/VBox", "sap/m/HBox", "ExToast"], function (formatCode, CodeEditor, Button, VBox, HBox, ExToast) {
  return class CustomCodeEditor extends VBox {
    constructor(config = {}) {
      const { fileName = "Editor", value = "Loading... Please wait while we fetch data", height = "70vh", type = "text", editable = false, width = "100%", ...otherConfig } = config;
      const editor = new CodeEditor({
        value,
        width,
        height,
        type,
        editable,
        ...otherConfig,
      });
      const buttons = new HBox({
        items: [
          new Button({
            text: "Copy",
            type: "Transparent",
            icon: "sap-icon://copy",
            press: () => {
              const value = editor.getValue();
              navigator.clipboard
                .writeText(value)
                .then(() => {
                  ExToast.show("Copied to clipboard", "success");
                })
                .catch((err) => {
                  ExToast.show("Failed to copy text: ", err, "error");
                  console.error("Failed to copy text: ", err);
                });
            },
          }),
          new Button({
            text: "Download",
            type: "Transparent",
            icon: "sap-icon://download",
            press: () => {
              const blob = new Blob([editor.getValue()], { type: "text/plain;charset=utf-8" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              const type = editor.getType();
              link.download = `DarkCPI_${fileName}.${type === "text" ? "txt" : type}`;
              link.click();
              URL.revokeObjectURL(link.href);
            },
          }),
        ],
      });
      super({
        items: [buttons, editor],
      });
      this.editor = editor;
    }

    setValue(value) {
      const data = formatCode.prettify(String(value));
      console.log(data);
      this.editor.setType(data.type);
      this.editor.setValue(data.code);
    }

    getEditor() {
      return this.editor;
    }
  };
});
