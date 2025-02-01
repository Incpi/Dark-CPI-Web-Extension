sap.ui.define(["constants", "sap/m/Dialog", "sap/m/Button"], function (constants, Dialog, Button) {
  let openDialog = null; // Track the currently open dialog

  return class Model extends Dialog {
    constructor({ id = null, title = "Dialog Title", content = [], endButton = {}, beginButton = null, verticalScrolling = true, contentWidth = "50%", icon = "sap-icon://darkcpi/logo-icon", ...otherConfig } = {}) {
      if (!Array.isArray(content)) {
        throw new Error("Content must be an array of SAPUI5 controls.");
      }
      const beginBtn = beginButton
        ? new Button({
            text: beginButton.label || "OK",
            press: beginButton.press || (() => {}),
          })
        : null;

      const endBtn = new Button({
        text: endButton.label || "Close",
        press: () => {
          if (endButton.press) endButton.press();
          this.close();
        },
      });

      super({
        id: id ? `${constants.prefixId}${id}` : undefined,
        title,
        contentWidth,
        icon,
        verticalScrolling,
        content,
        beginButton: beginBtn,
        endButton: endBtn,
        ...otherConfig,
      });
      if (openDialog) {
        openDialog.close();
      }
      openDialog = this;
      this.open();

      // Return a Proxy to dynamically forward method calls to the dialog
      return new Proxy(this, {
        get: (target, prop) => (typeof target[prop] === "function" ? target[prop].bind(target) : target[prop]),
      });
    }

    // Override close to destroy the dialog and clean up children
    close() {
      this.detachChildEventListeners();
      super.close();
      this.attachAfterClose(() => {
        this.destroy();
      });
    }

    // Clean up child event listeners
    detachChildEventListeners() {
      const content = this.getContent();
      if (Array.isArray(content)) {
        content.forEach((control) => {
          if (control instanceof sap.ui.core.Control) {
            control.detachBrowserEvent("click");
            control.destroy();
          }
        });
      }
    }

    destroy() {
      this.detachChildEventListeners();
      super.destroy();
      openDialog = null;
    }
  };
});
