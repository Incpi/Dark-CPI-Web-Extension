sap.ui.define([], function() {
  "use strict";
  return {
    prefixId: "_DarkCPI_",
    manifestVersion: "2.1.3",
    allowedCPI: /^https:\/\/.*\.(hana\.ondemand\.com|platform\.sapcloud\.cn)\/.*$/,
    apiBaseCPI: /^.*integrationsuite.*.cfapps/.test(window.location.origin) ? window.location.origin : window.location.origin + "/itspaces",
    data_update_label: { bugFixes: "Bug Fixes", improvements: "Improvements", features: "Features" },
    data_updates: {
      bugFixes: [
        { description: "More CSS fixes: where the scrollable section in the configuration window is not scrollable." },
        { description: "Panels in trace, logs, design page CSS fixes where in exceptional cases overflow & Clipping text issues in dark mode" },
      ],
      features: [],
      improvements: [
        { description: "Load time was decreased by optimizing the extension runtime." },
        { description: "Decreased extension size and external libraries." },
        { description: "Limited style overwrites to ensure a seamless native experience." },
      ],
    },
    neededLinks: [{
      label: "List of Internal Headers and Properties",
      link: "https://help.sap.com/docs/cloud-integration/sap-cloud-integration/headers-and-exchange-properties-provided-by-integration-framework?trk=feed-detail_comments-list_comment-text",
    }, {
      label: "Groovy IDE", link: "https://groovyide.com/cpi",
    }, {
      label: "Convita IDE", link: "https://ide.contiva.com/",
    }, {
      label: "SAP CPI Help", link: "https://help.sap.com/docs/cloud-integration?locale=en-US",
    }],
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
      sapblog: "https://community.sap.com/t5/technology-blogs-by-members/introducing-dark-cpi-web-extension-for-sap-applications/bc-p/13860794",
    },
    noticeType: ["Warning", "Error", "Success", "Information", "None"],
    notice: [
      // {text: `All control has been moved from the popup to the webpage header - "DC" icon.`, type: "Warning | Error", showIcon: true, visible: true,}
    ],
  };
});
