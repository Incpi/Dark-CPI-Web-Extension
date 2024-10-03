"use strict";
const hostmap = [
  [/(.*)launchpad\.cfapps.*\.hana\.ondemand\.com/, "launchpad"],
  [/(.*)\.(hci|integrationsuite(-trial)?.*)/, "cpi"],
  [/.*(pimas|intas){1}.*\.cfapps.*\.hana\.ondemand\.com/, "cpi_app"],
];

const lunchpadtheme = {
  2: { name: "sap_fiori_3", label: "Quartz Light", buttonlabel: "Default" },
  1: { name: "sap_fiori_3_dark", label: "Quartz Dark", buttonlabel: "Dark UI" },
};

const cpithemes = {
  0: { name: "sap_horizon", label: "Morning Horizon", buttonlabel: "Default" },
  1: { name: "sap_horizon_dark", label: "Evening Horizon", buttonlabel: "Dark UI" },
  2: { name: "sap_fiori_3", label: "Quartz Light", buttonlabel: "Old UI" },
};
