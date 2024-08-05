/* 
    type: typeof options(feature, bugfix, improvements) 
    @type:{@description, @author(should be in the data_authors list)}
    samples: {features: [ { description: "Feature 1", author: "Omkar" },]}
*/
const data_updates = {
  bugFixes: [
    { description: "SAP UI theme Horizon dark fix (Trace half screnn non visible)", author: "Omkar", },
    { description: "Mapping fields are invisible in mmap Files." },
    { description: "Simulation error color is not correct." },
  ],
  features: [
    { description: "Added support for addtional <b>SAP CPI - fka HCI / old Tenents<b>", },
    { description: "Now supports addtional application such as <b>SAP Builds workzone</b> and it's theme designer.", },
    { description: "Dark theme supports CPI capablities like <b>Integration Assessment & Migration Assessment</b>", },
  ],
  improvements: [{ description: "UI improvement:  UI changes for popup." }],
};

/* 
    @type: @label for type

    Note: above section are orderd by below data order
*/
const data_sections = {
  bugFixes: "Bug Fixes",
  features: "Features",
  improvements: "Improvements",
};
/* 
    @name: @developer link
*/
const data_authors = {
  Omkar: "https://github.com/incpi",
};
