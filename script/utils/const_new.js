sap.ui.define([], function () {
  "use strict";
  return {
    data_update_label: { bugFixes: "Bug Fixes", improvements: "Improvements", features: "Features" },
    data_updates: {
      bugFixes: [{ description: "Resolved CSS issues preventing the scrollable section in the configuration window from functioning correctly." }, { description: "Fixed overflow and text clipping issues in the trace, logs, and design pages, especially in dark mode, ensuring a seamless user experience." }],
      features: [{ description: "Introduced a quick message popup feature, similar to the CPI helper popup, for enhanced user communication." }, { description: "Added an automatic trace activation on expiry in Power Trace for more efficient monitoring." }, { description: "Inline payload formatting is now available in the trace view for clearer data presentation." }, { description: "Quick links to the trace page and log monitoring page have been implemented for easier navigation." }, { description: "Table sorting and filtering are now standard UI features, improving data accessibility and usability." }],
      improvements: [{ description: "Optimized the extension runtime, significantly reducing load times for better performance." }, { description: "Reduced the extension size by minimizing dependencies and optimizing external libraries." }, { description: "Limited style overrides to ensure a more consistent and native user experience." }],
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
    neededLinks: [
      {
        label: "List of Internal Headers and Properties",
        link: "https://help.sap.com/docs/cloud-integration/sap-cloud-integration/headers-and-exchange-properties-provided-by-integration-framework?trk=feed-detail_comments-list_comment-text",
      },
      {
        label: "Groovy IDE",
        link: "https://groovyide.com/cpi",
      },
      {
        label: "Convita IDE",
        link: "https://ide.contiva.com/",
      },
      {
        label: "SAP CPI Help",
        link: "https://help.sap.com/docs/cloud-integration?locale=en-US",
      },
    ],
    footer: {
      label: "Report Issues",
      Link: "https://github.com/incpi/Dark-CPI-Web-Extension/issues",
    },
  };
});
