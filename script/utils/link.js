sap.ui.define(["constants"], function (constants) {
  return {
    openLogTab: (iflowName) => {
      window.open(`${constants.apiBaseCPI}/shell/monitoring/Messages/{"status":"ALL","artifact":"${iflowName}","time":"PASTHOUR","useAdvancedFields":false}`, "_blank");
    },
    infoLog: (MessageID) => {
      const url = `${constants.apiBaseCPI}/shell/monitoring/Messages/{"identifier":"${MessageID}"}`;
      window.open(url, "_blank");
    },
    traceLog: (MessageID, RunID = null) => {
      // apiCall.httpReq()
      const url = `${constants.apiBaseCPI}/shell/monitoring/MessageProcessingRun/{"parentContext":{"MessageMonitor":
			{"artifactKey":"__ALL__MESSAGE_PROVIDER","artifactName":"All Artifacts"}},
			"messageProcessingLog":"${MessageID}",${RunID ? '"RunId":"' + RunID + '"}' : ""}`;
      window.open(url, "_blank");
    },
    activeTrace: async (idFlow) => {
      const url = `${constants.apiBaseURLCPI}${constants.serviceURL.logLevel}`;
      const body = `{"artifactSymbolicName":"${idFlow}","mplLogLevel":"TRACE","nodeType":"IFLMAP"}`;
      let headers = [{ "Content-Type": "application/json" }];
      let status;
      try {
        const response = await net.callService(url, "POST", headers, body, true);
        status = response.status;
      } catch (error) {
        status = error.status;
      }
      return status;
    },
  };
});
