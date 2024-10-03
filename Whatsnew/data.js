/* 
    type: typeof options(feature, bugfix, improvements) 
    @type:{@description, @author(should be in the data_authors list)}
    samples: {features: [ { description: "Feature 1", author: "Omkar" },]}
*/

const data_updates = {
  bugFixes: [
    {
      description: "Events includes further minor UI tweaks and consistent bit order",
    },
    {
      description: "User prefer schema (Light/dark) will not effect UI with CPI Helper",
    },
    {
      description: 'SAP UI theme Horizon dark fix, <br> if any issue found. <strong><a href="https://github.com/incpi/Dark-CPI-Web-Extension/issues" target="_blank">Report here</a></strong>',
    },
  ],
  features: [
    {
      description: "Adding Release on github to quickly get binary via github.",
    },
    {
      description: "Added support for addtional <b>SAP CPI - fka HCI / old Tenents<b>",
    },
  ],
  improvements: [
    {
      description: "load time was decreased by optimizing the extension runtime",
    },
    {
      description: "Limited CSS overwrites to ensure a seamless native experience.",
    },
  ],
};

/* 
    @type: @label for type

    Note: above section are orderd by below data order
*/
const data_sections = {
  bugFixes: "Bug Fixes",
  improvements: "Improvements",
  features: "Features",
};
/* 
    @name: @developer link
*/
const data_authors = {
  Omkar: "https://github.com/incpi",
};
