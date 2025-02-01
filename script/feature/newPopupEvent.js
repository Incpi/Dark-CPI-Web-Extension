function handleInputChange(inputValue) {
  const unixCopyBtn = sap.ui.getCore().byId("unixCopyBtn");
  const isoCopyBtn = sap.ui.getCore().byId("isoCopyBtn");

  if (!inputValue) {
    unixCopyBtn.setText("Unix: ");
    isoCopyBtn.setText("ISO: ");
    unixCopyBtn.setVisible(false);
    isoCopyBtn.setVisible(false);
    return;
  }

  try {
    if (/^\d+$/.test(inputValue)) {
      // Unix timestamp
      const timestamp = inputValue.length === 10 ? parseInt(inputValue, 10) * 1000 : parseInt(inputValue, 10);
      if (isNaN(timestamp)) throw new Error("Invalid Unix timestamp.");
      unixCopyBtn.setText(`Unix: ${inputValue}`);
      isoCopyBtn.setText(`ISO: ${new Date(timestamp).toISOString()}`);
    } else {
      // ISO timestamp
      const timestamp = new Date(inputValue).getTime();
      if (isNaN(timestamp)) throw new Error("Invalid ISO format.");
      unixCopyBtn.setText(`Unix: ${timestamp}`);
      isoCopyBtn.setText(`ISO: ${inputValue}`);
    }
    unixCopyBtn.setVisible(true);
    isoCopyBtn.setVisible(true);
  } catch (error) {
    unixCopyBtn.setText("");
    isoCopyBtn.setText("");
    unixCopyBtn.setVisible(false);
    isoCopyBtn.setVisible(false);
  }
}

function handleDatePickerChange(dateValue) {
  const unixCopyBtn = sap.ui.getCore().byId("unixCopyBtn");
  const isoCopyBtn = sap.ui.getCore().byId("isoCopyBtn");

  // Helper function to reset buttons
  const resetButtons = () => {
    unixCopyBtn.setText("Unix: ");
    isoCopyBtn.setText("ISO: ");
    unixCopyBtn.setVisible(false);
    isoCopyBtn.setVisible(false);
  };

  if (!dateValue) {
    resetButtons();
    return;
  }

  // Parse the dateValue explicitly as UTC
  const date = new Date(dateValue + " UTC"); // Add 'UTC' to enforce UTC interpretation

  // Validate the date
  if (isNaN(date.getTime())) {
    console.error("Invalid UTC date value provided:", dateValue);
    resetButtons();
    return;
  }

  // Convert to Unix timestamp and ISO string
  const unixTimestamp = date.getTime();
  const isoString = date.toISOString();

  // Update button text and visibility
  unixCopyBtn.setText(`Unix: ${unixTimestamp}`);
  isoCopyBtn.setText(`ISO: ${isoString}`);
  unixCopyBtn.setVisible(true);
  isoCopyBtn.setVisible(true);
}

sap.ui.define(["constants", "const_new", "RequestQueue", "timeConvert", "apiCall", "common", "sap/m/Avatar", "sap/m/DateTimePicker", "model", "sap/m/Title", "sap/m/Button", "sap/m/VBox", "sap/m/HBox", "sap/m/Input", "sap/m/StandardListItem", "sap/m/Text", "sap/m/Link", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/m/MessageStrip", "sap/m/StepInput"], function (constants, const_new, RequestQueue, timeConvert, apiCall, common, Avatar, DateTimePicker, Model, Title, Button, VBox, HBox, Input, StandardListItem, Text, Link, IconTabBar, IconTabFilter, MessageStrip, StepInput) {
  "use strict";
  const updateTime = () => {
    const now = new Date();
    const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const utcButton = sap.ui.getCore().byId(`${constants.prefixId}utcTime`);
    const localButton = sap.ui.getCore().byId(`${constants.prefixId}localTime`);
    if (utcButton && localButton) {
      utcButton.setText(`UTC Time: ${timeConvert.formatDate(utcTime)}`);
      localButton.setText(`Local Time: ${timeConvert.formatDate(now)}`);
    }
  };
  const popup_settings = async (selectedKey = "settings") => {
    let intervalId;
    const user = String(await apiCall.User()).toUpperCase();
    const mode = async (number) => {
      const theme = constants.cpithemes[number].name;
      sap.ui.getCore().applyTheme(theme);
      // sap.ui.getCore().byId(`${constants.prefixId}ExtButton`).setIcon(icon);
      localStorage.setItem(`${constants.prefixId}Theme`, theme);
      await RequestQueue.setData("Theme", theme);
      sap.m.MessageToast.show(`${constants.cpithemes[number].buttonlabel} Theme applied`);
    };

    const help_Links = (links, maxLinksPerRow = 4) => {
      // Split links into chunks of maxLinksPerRow
      const linkChunks = [];
      for (let i = 0; i < links.length; i += maxLinksPerRow) {
        linkChunks.push(links.slice(i, i + maxLinksPerRow));
      }
      // Return the VBox containing all the rows
      return new VBox({
        width: "100%",
        justifyContent: "SpaceAround",
        items: linkChunks.map(
          (chunk) =>
            new HBox({
              items: chunk.map((e) => new Link({ text: e.label, target: "_blank", href: e.link })),
              justifyContent: "SpaceBetween",
              width: "100%",
            })
        ),
      });
    };

    const oGitHubSection = new VBox({
      items: [
        new HBox({
          items: [
            new Text({ text: "For news and interesting blog posts about SAP CI, please follow me on" }),
            new Link({
              text: "LinkedIn Page",
              target: "_blank",
              href: const_new.author.linkdin,
            }).addStyleClass("sapUiTinyMarginBeginEnd"),
          ],
          alignItems: "Start",
        }),
        new HBox({
          items: [
            new Text({ text: "This plugin is developed by" }),
            new Link({
              text: "Omkar Patel",
              target: "_blank",
              href: const_new.author.github,
            }).addStyleClass("sapUiTinyMarginBeginEnd"),
          ],
          alignItems: "Start",
        }),
        new HBox({
          items: [
            new Text({ text: "Feel free to contribute on our" }),
            new Link({
              text: "GitHub Page",
              target: "_blank",
              href: const_new.author.githubrepo,
            }).addStyleClass("sapUiTinyMarginBeginEnd"),
          ],
          alignItems: "Start",
        }),
        new HBox({
          items: [
            new Text({ text: "Please share and Visit" }),
            new Link({
              text: "Community blog Page",
              target: "_blank",
              href: const_new.author.sapblog,
            }).addStyleClass("sapUiTinyMarginBeginEnd"),
          ],
          alignItems: "Start",
        }),
      ],
    });

    const oNotice = const_new.notice.map((record) => {
      if (record) return new MessageStrip(record).addStyleClass("sapUiMediumMarginTop");
    });

    const settingsTab = async () => {
      let debounceTimeout;
      const lastMsg = Number(await RequestQueue.getData("lASTMSG")) || 10;
      const stepInput = new StepInput({
        max: 20,
        min: 0,
        width: "2em",
        validationMode: "FocusOut",
        value: lastMsg,
        change: (e) => RequestQueue.setData("lASTMSG", e.getParameter("value")),
      });
      const localTheme = () => {
        const theme = localStorage.getItem(`${constants.prefixId}Theme`);
        return theme ? theme : "sap_horizon";
      };
      // SegmentedButton for theme selection
      const themeSelectionButton = new sap.m.SegmentedButton({
        selectedItem: `${Object.entries(constants.cpithemes).find(([_, rec]) => rec.name === localTheme() || "sap_horizon")[0]}`,
        items: Object.entries(constants.cpithemes).map(
          ([key, theme]) =>
            new sap.m.SegmentedButtonItem({
              text: theme.buttonlabel,
              tooltip: `Switch to ${theme.label} theme`,
              press: () => mode(key),
            })
        ),
      })
        .setWidth("90%")
        .addStyleClass("sapUiTinyMargin")
        .addStyleClass("DarkcpiTheme");

      return [
        new sap.ui.layout.Grid({
          defaultSpan: "L12 M12 S12",
          hSpacing: 1,
          vSpacing: 1,
          content: [
            new sap.ui.layout.Grid({
              defaultSpan: "L6 M6 S12",
              content: [
                new Title({
                  text: "Choose Theme:",
                  level: sap.ui.core.TitleLevel.H3,
                }),
                themeSelectionButton,
              ],
            }),
            new sap.ui.layout.Grid({
              defaultSpan: "L6 M6 S12",
              content: [
                new Title({
                  text: "Choose Step messages:",
                  level: sap.ui.core.TitleLevel.H3,
                }),
                stepInput,
              ],
            }),
          ],
        }),
      ];
    };

    const timeTab = () => {
      return [
        new VBox({
          items: [
            new VBox({
              width: "100%",
              items: [
                new Title({
                  text: "Time Information",
                  level: sap.ui.core.TitleLevel.H3,
                }),
                new Text({
                  id: `${constants.prefixId}utcTime`,
                  text: "Loading UTC Time...",
                }),
                new Text({
                  id: `${constants.prefixId}localTime`,
                  text: "Loading Local Time...",
                }).addStyleClass("sapUiTinyMarginBottom"),
                new HBox({
                  items: [
                    new Button({
                      type: sap.m.ButtonType.Transparent,
                      icon: "sap-icon://copy",
                      text: "ISO (UTC)",
                      press: () => common.copyToClipboard(new Date().toISOString()),
                    }),
                    new Button({
                      type: sap.m.ButtonType.Transparent,
                      icon: "sap-icon://copy",
                      text: "Unix (UTC)",
                      press: () => common.copyToClipboard(Math.floor(new Date().getTime() / 1000).toString()),
                    }),
                  ],
                  width: "100%",
                  alignItems: "Center",
                }),
              ],
            }),
            new VBox({
              items: [
                new Title({
                  text: "Time Converter",
                  level: sap.ui.core.TitleLevel.H3,
                }),
                new Text({
                  text: "Enter timestamp in UTC (Unix, ISO, or select from DateTime Picker):",
                }),
                new HBox({
                  width: "100%",
                  alignItems: "Center",
                  items: [
                    // Normal Input Field
                    new Input({
                      id: "timestampInput",
                      placeholder: "Enter Unix or ISO timestamp...",
                      width: "100%",
                      layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                      liveChange: function (oEvent) {
                        const inputValue = oEvent.getParameter("value").trim();
                        const datetimePicker = sap.ui.getCore().byId("datetimePicker");
                        datetimePicker.setValue(""); // Clear DateTimePicker
                        handleInputChange(inputValue);
                      },
                    }),
                    new Text({ text: "OR" }).addStyleClass("sapUiTinyMarginBeginEnd"), // DateTimePicker Input
                    new DateTimePicker({
                      id: "datetimePicker",
                      width: "100%",
                      placeholder: "Select a date and time...",
                      layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                      change: function (oEvent) {
                        const dateValue = oEvent.getParameter("value");
                        const inputField = sap.ui.getCore().byId("timestampInput");
                        inputField.setValue(""); // Clear the input field
                        handleDatePickerChange(dateValue);
                      },
                    }),
                  ],
                }).addStyleClass("sapUiTinyMarginTopBottom"),

                // Result Box for both Unix and ISO timestamps
                new HBox({
                  items: [
                    new Button({
                      width: "100%",
                      layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                      id: "unixCopyBtn",
                      icon: "sap-icon://copy",
                      visible: false,
                      press: () => {
                        const resultUnix = sap.ui.getCore().byId("unixCopyBtn").getText().replace("Unix: ", "");
                        if (resultUnix) common.copyToClipboard(resultUnix);
                      },
                    }).addStyleClass("sapUiTinyMarginEnd"),
                    new Button({
                      width: "100%",
                      layoutData: new sap.m.FlexItemData({ growFactor: 1 }),
                      id: "isoCopyBtn",
                      icon: "sap-icon://copy",
                      visible: false,
                      press: () => {
                        const resultISO = sap.ui.getCore().byId("isoCopyBtn").getText().replace("ISO: ", "");
                        if (resultISO) common.copyToClipboard(resultISO);
                      },
                    }).addStyleClass("sapUiTinyMarginBegin"),
                  ],
                }),
              ],
            }).addStyleClass("sapUiMediumMarginTop"),
          ],
        }),
      ];
    };

    const dialog = new Model({
      title: `Dark CPI Panel`,
      id: `${constants.prefixId}Settings`,
      contentWidth: "50%",
      icon: "sap-icon://darkcpi/logo-icon",
      verticalScrolling: true,
      content: [
        new HBox({
          alignItems: "Center",
          items: [
            new sap.tnt.InfoLabel({
              text: `Version: ${$.sap.DarkCPI.version}`,
              icon: "sap-icon://pushpin-on",
              displayOnly: false,
              colorScheme: 8,
            }).addStyleClass("sapUiMediumMarginEnd"),
            new Title({ text: "User:" }),
            new Avatar({
              displaySize: "XS", // backgroundColor: "Transparent",
              initials: user.substring(0, 2),
            }).addStyleClass("sapUiTinyMarginBeginEnd"),
            new Text({ text: user }),
          ],
        }),
        new VBox({
          items: [
            new IconTabBar({
              selectedKey: selectedKey,
              select: (oEvent) => {
                const selectedTab = oEvent.getParameter("selectedKey");

                // Start updating time only when "time" tab is active
                if (selectedTab === "time") {
                  if (!intervalId) {
                    intervalId = setInterval(updateTime, 1000);
                  }
                } else {
                  clearInterval(intervalId);
                  intervalId = null;
                }
              },
              items: [
                new IconTabFilter({
                  key: "whatsNew",
                  text: "What's New",
                  content: [
                    new VBox({
                      items: Object.entries(const_new.data_update_label).map(([sectionKey, sectionTitle]) => {
                        const items = const_new.data_updates[sectionKey] || [];
                        if (items.length > 0) {
                          return new VBox({
                            items: [
                              new Title({
                                text: sectionTitle,
                                level: sap.ui.core.TitleLevel.H3,
                              }),
                              new sap.m.List({
                                items: items.map(
                                  (item) =>
                                    new StandardListItem({
                                      title: item.description,
                                      type: sap.m.ListType.Inactive,
                                    })
                                ),
                              }),
                            ],
                          }).addStyleClass("sapUiTinyMargin");
                        }
                      }),
                    }),
                  ],
                }),
                new IconTabFilter({
                  key: "settings",
                  text: "Settings",
                  content: await settingsTab(),
                }),
                new IconTabFilter({
                  key: "time",
                  text: "Time information",
                  content: timeTab(),
                }),
              ],
            }),
          ],
        }),
        new VBox({
          items: [
            new Title({ text: "Github Contacts", level: sap.ui.core.TitleLevel.H3 }),
            new HBox({
              items: [
                new Avatar({
                  displaySize: "L",
                  backgroundColor: "Transparent",
                  fallbackIcon: "sap-icon://darkcpi/logo-icon-2",
                }),
                new VBox({ items: oGitHubSection }).addStyleClass("sapUiSmallMarginBegin"),
              ],
            }),
          ],
        }).addStyleClass("sapUiSmallMarginTop"),
        new VBox({
          items: [
            new Title({
              text: "Handy Links",
              level: sap.ui.core.TitleLevel.H3,
            }),
            help_Links(const_new.neededLinks),
          ],
        }).addStyleClass("sapUiSmallMarginTop"),
        oNotice,
      ],
      endButton: {
        press: () => localStorage.setItem(`${constants.prefixId}Version`, $.sap.DarkCPI.version),
      },
      beginButton: {
        label: const_new.footer.label,
        press: () => window.open(const_new.footer.Link, "_blank"),
      },
    });
    dialog.open();
  };
  return { popup_settings };
});
