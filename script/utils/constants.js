sap.ui.define([], function () {
  "use strict";
  return {
    prefixId: "__DarkCPI",
    allowedCPI: /^https:\/\/.*\.(hana\.ondemand\.com|platform\.sapcloud\.cn)\/.*$/,
    isCF: Boolean(/^.*integrationsuite.*.cfapps/.test(window.location.origin)),
    apiBaseCPI: /^.*integrationsuite.*.cfapps/.test(window.location.origin) ? window.location.origin : window.location.origin + "/itspaces",
    serviceURL: {
      logLevel: "/Operations/com.sap.it.op.tmn.commands.dashboard.webui.IntegrationComponentSetMplLogLevelCommand",
      logInfo: "/Operations/com.sap.it.op.tmn.commands.dashboard.webui.MplDetailCommand",
      listIflow: "/Operations/com.sap.it.op.tmn.commands.dashboard.webui.IntegrationComponentsListCommand",
      listDetailsIflow: "/Operations/com.sap.it.op.tmn.commands.dashboard.webui.IntegrationComponentDetailCommand",
      undeploy: "/Operations/com.sap.it.nm.commands.deploy.DeleteContentCommand",
      apiUser: "/api/1.0/user",
      apiv1: "/odata/api/v1",
    },
    cpithemes: {
      0: { name: "sap_horizon", label: "Morning Horizon", buttonlabel: "Default" },
      1: {
        name: "sap_horizon_dark",
        label: "Evening Horizon",
        buttonlabel: "Dark UI",
      },
      2: {
        name: "sap_fiori_3",
        label: "Quartz Light",
        buttonlabel: "Old UI",
      },
    },
  };
});
