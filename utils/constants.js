sap.ui.define([], function() {
  "use strict";
  return {
    prefixId: "DarkCPI_",
    manifestVersion: "2.1.0",
    data_update_label: { bugFixes: "Bug Fixes", improvements: "Improvements", features: "Features" },
    data_updates: {
      bugFixes: [], features: [], improvements: [
        { description: "FireFox support has been added." },
        { description: "Load time was decreased by optimizing the extension runtime." },
        { description: "Decreased extension size and external libraries." },
        { description: "Limited CSS overwrites to ensure a seamless native experience." },
      ],
    },
    footer: {
      label: "Report Issues", Link: "https://github.com/incpi/Dark-CPI-Web-Extension/issues",
    },
    cpithemes: {
      0: {
        name: "sap_horizon", label: "Morning Horizon", buttonlabel: "Default",
      }, 1: {
        name: "sap_horizon_dark", label: "Evening Horizon", buttonlabel: "Dark UI",
      }, 2: {
        name: "sap_fiori_3", label: "Quartz Light", buttonlabel: "Old UI",
      },
    },
    author: {
      linkdin: "https://linkedin.com/in/incpi",
      github: "https://github.com/incpi",
      githubrepo: "https://github.com/incpi/Dark-CPI-Web-Extension",
    },
    noticeType: ["Warning", "Error", "Success", "Information", "None"],
    notice: [
      {
        text: `All control has been moved from the popup to the webpage header - "DC" icon.`,
        type: "Warning",
        showIcon: true,
        visible: true,
      }, {
        text: `Important Notice:\n
            We will be discontinuing support for SAP Build and Theme Designer.
            If you'd like to continue using the tool, please refer to version v1.3.7.
            For any issues or suggestions regarding this change, please report them below.`,
        type: "Error",
        showIcon: true,
        visible: true,
      }],
  };
});
