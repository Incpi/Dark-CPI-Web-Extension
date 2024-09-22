/* 
    type: typeof options(feature, bugfix, improvements) 
    @type:{@description, @author(should be in the data_authors list)}
    samples: {features: [ { description: "Feature 1", author: "Omkar" },]}
*/
const data_updates = {
  bugFixes: [
    {
      description: "CPI panel display on serach fix",
    },
    {
      description:
        'SAP UI theme Horizon dark fix (Trace half screnn non visible) if any issue found. <a href="https://github.com/incpi/Dark-CPI-Web-Extension/issues" target="_blank">Report here</a>',
    },
  ],
  features: [
    {
      description:
        "Added support for addtional <b>SAP CPI - fka HCI / old Tenents<b>",
    },
    {
      description:
        "Now supports addtional application such as <b>SAP Builds workzone</b> and it's theme designer.",
    },
  ],
  improvements: [
    { description: "Reduce Extension size From 2 Mb to Approx. 350Kb" },
  ],
};

/* 
    @type: @label for type

    Note: above section are orderd by below data order
*/
const data_sections = {
  improvements: "Improvements",
  bugFixes: "Bug Fixes",
  features: "Features",
};
/* 
    @name: @developer link
*/
const data_authors = {
  Omkar: "https://github.com/incpi",
};
