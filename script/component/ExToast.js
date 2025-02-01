sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
  "use strict";
  return class ExToast {
    static show(message, toastClass = "default", config = {}) {
      const classMap = {
        warning: "__DarkCPI_Attention_bg",
        error: "__DarkCPI_Reject_bg",
        success: "__DarkCPI_Accept_bg",
        info: "__DarkCPI_Neutral_bg",
        default: "__DarkCPI_Default_bg",
      };
      MessageToast.show(message, config);
      if (classMap[toastClass]) {
        setTimeout(() => $(".sapMMessageToast").addClass(classMap[toastClass]), 50);
      }
    }
  };
});
