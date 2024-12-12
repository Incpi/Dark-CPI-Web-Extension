sap.ui.loader.config({
  paths: {
    constants: `${$.sap.chromeExtensionURL}utils/constants`,
    timeConvert: `${$.sap.chromeExtensionURL}utils/timeConvert`,
  },
});

sap.ui.define(["constants", "timeConvert", "sap/m/BusyDialog", "sap/m/Dialog", "sap/m/Image", "sap/m/Title",
    "sap/m/Button", "sap/m/VBox", "sap/m/HBox", "sap/m/MenuItem", "sap/m/Menu", "sap/m/Input",
    "sap/m/StandardListItem", "sap/m/Text", "sap/m/Link", "sap/m/Toolbar", "sap/m/ToolbarSpacer", "sap/m/IconTabBar", "sap/m/IconTabFilter", "sap/m/MessageStrip"],
  function(constants, timeConvert, BusyDialog, Dialog, Image, Title, Button, VBox, HBox, MenuItem, Menu, Input, StandardListItem, Text, Link, Toolbar, ToolbarSpacer, IconTabBar, IconTabFilter, MessageStrip) {
    "use strict";
    const localtheme = () => localStorage.getItem(`${constants.prefixId}Theme`) || "sap_horizon";
    return {
      new_theme: (selectedKey = "settings") => {
        var oGitHubSection = new VBox({
          items: [// LinkedIn Message
            new HBox({
              items: [new Text({
                text: "For news and interesting blog posts about SAP CI, please follow me on",
              }), new Link({
                text: "LinkedIn Page", target: "_blank", href: constants.author.linkdin,
              }).addStyleClass("sapUiTinyMarginBeginEnd")], alignItems: "Start",
            }),

            // Developer Name as a Hyperlink
            new HBox({
              items: [new Text({ text: "This plugin is developed by" }), new Link({
                text: "Omkar patel", target: "_blank", href: constants.author.github,
              }).addStyleClass("sapUiTinyMarginBeginEnd"), new Text({ text: "." }), // For punctuation
              ], alignItems: "Start",
            }),

            // GitHub Page as a Hyperlink
            new HBox({
              items: [new Text({ text: "Feel free to contribute on our" }), new Link({
                text: "GitHub Page", target: "_blank", href: constants.author.githubrepo,
              }).addStyleClass("sapUiTinyMarginBeginEnd"), new Text({ text: "." }), // For punctuation
              ], alignItems: "Start",
            })],
        });

        var oNotice = constants.notice.map((record, index) => {
          if (record !== undefined && record !== null) {
            return new MessageStrip(record).addStyleClass("sapUiMediumMarginTop");
          }
        });

        function mode(number) {
          let theme = constants.cpithemes[number].name;
          sap.ui.getCore().applyTheme(theme);
          sap.ui
            .getCore()
            .byId(`${constants.prefixId}ExtButton`)
            .setIcon(theme !== "sap_horizon_dark" ? "sap-icon://light-mode" : "sap-icon://dark-mode");
          localStorage.setItem(`${constants.prefixId}Theme`, theme);
          sap.m.MessageToast.show(constants.cpithemes[number].buttonlabel + " Theme applied");
        }

        let dialog = sap.ui.getCore().byId(`${constants.prefixId}Settings`);

        if (!dialog) {
          const dialog = new Dialog({
            title: `Dark CPI V.${constants.manifestVersion} Panel`,
            id: `${constants.prefixId}Settings`,
            contentWidth: "50%",
            icon: "sap-icon://dark-mode",
            verticalScrolling: true,
            content: [new IconTabBar({
              selectedKey: selectedKey, items: [new IconTabFilter({
                key: "whatsNew", text: "What's New", content: [new VBox({
                  items: [new VBox({
                    items: Object.entries(constants.data_update_label).map(([sectionKey, sectionTitle]) => {
                      const items = constants.data_updates[sectionKey] || [];
                      if (items && items.length > 0) {
                        return new VBox({
                          items: [new Title({
                            text: sectionTitle, level: sap.ui.core.TitleLevel.H3,
                          }), new sap.m.List({
                            items: items.map((item) => new StandardListItem({
                              title: item.description, type: sap.m.ListType.Inactive,
                            })),
                          })],
                        }).addStyleClass("sapUiTinyMarginTop");
                      }
                    }),
                  })],
                })],
              }), new IconTabFilter({
                key: "settings", text: "Settings", content: [new HBox({
                  items: [
                    new VBox({
                      width: "100%",
                      items: [new Title({
                        text: "Choose Theme: ", level: sap.ui.core.TitleLevel.H3,
                      }),

                        new sap.m.SegmentedButton({
                          selectedItem: `${Object.entries(constants.cpithemes).filter(([key, rec]) => rec.name === localtheme())[0][1].buttonlabel}`,
                          items: Object.entries(constants.cpithemes).map(([key, theme]) => new sap.m.SegmentedButtonItem({
                            text: theme.buttonlabel,
                            tooltip: `Switch to ${theme.label} theme`,
                            press: () => mode(key),
                          })),
                        }).setWidth("90%")
                          .addStyleClass("sapUiTinyMargin")],
                    }), new VBox({
                      width: "100%",
                      items: [new Title({
                        text: "Time Information", level: sap.ui.core.TitleLevel.H3,
                      }),
                        new Text({
                          id: "utcTime", text: "Loading UTC Time...",
                        }),
                        new Text({
                          id: "localTime", text: "Loading Local Time...",
                        }).addStyleClass("sapUiTinyMarginBottom"),
                        new HBox({
                          items: [new Title({
                            text: "Live Time: ",
                          }), new Button({
                            type: sap.m.ButtonType.Transparent,
                            icon: "sap-icon://copy",
                            text: "ISO (UTC)",
                            press: () => copyToClipboard(new Date(new Date().getTime()).toISOString()),
                          }),
                            new Button({
                              type: sap.m.ButtonType.Transparent,
                              icon: "sap-icon://copy",
                              text: "Unix (UTC)",
                              press: () => copyToClipboard((Math.floor(new Date().getTime() / 1000) * 1000).toString()),
                            }),
                          ],
                          width: "100%", alignItems: "Center",
                        }).addStyleClass("sapUiSmallMarginTop"),
                        new HBox({
                          items: [
                            new Input({
                              id: "timestampInput",
                              placeholder: "Enter Unix or ISO timestamp...",
                              width: "100%",
                            }),
                            new Button({
                              width: "100%",
                              text: "Convert",
                              press: () => {
                                const input = sap.ui.getCore().byId("timestampInput").getValue();
                                let result;
                                let isUnix = !isNaN(input); // Check if input is numeric
                                if (isUnix) {
                                  // Input is a Unix timestamp
                                  const timestamp = input.length === 10 ? parseInt(input, 10) * 1000 : parseInt(input, 10);
                                  result = new Date(timestamp).toISOString();
                                  sap.ui.getCore().byId("resultUnix").setText(`ISO: ${result}`);
                                  sap.ui.getCore().byId("unixCopyBtn").setVisible(true);
                                } else {
                                  // Input is an ISO timestamp
                                  try {
                                    result = new Date(input).getTime();
                                    sap.ui.getCore().byId("resultUnix").setText(`Unix: ${result}`);
                                    sap.ui.getCore().byId("unixCopyBtn").setVisible(true);
                                  } catch (e) {
                                    result = "Invalid input format.";
                                    sap.ui.getCore().byId("resultUnix").setText(result);
                                    sap.ui.getCore().byId("unixCopyBtn").setVisible(false);
                                  }
                                }
                              },
                            }),
                          ], width: "100%",
                        }),
                        new HBox({
                          items: [
                            new Text({
                              id: "resultUnix",
                              text: "",
                            }).addStyleClass("sapUiSmallMarginEnd"), // Add margin to separate text and button
                            new Button({
                              id: "unixCopyBtn",
                              icon: "sap-icon://copy",
                              tooltip: "Copy Converted Unix Timestamp",
                              visible: false, // Initially hidden
                              press: () => {
                                const resultUnix = sap.ui.getCore().byId("resultUnix").getText().replace("Unix: ", "").replace("ISO: ", "");
                                if (resultUnix) copyToClipboard(resultUnix);
                              },
                            }),
                          ], width: "100%", alignItems: "Center",
                        })],
                    })],
                })],
              })],
            }), new HBox({
              items: [new Image({
                src: `${$.sap.chromeExtensionURL}images/icon128.png`,
                height: "100px",
                decorative: false,
                alt: "Company Logo",
              }), new VBox({
                items: [new Title({
                  text: "Github Contacts", level: sap.ui.core.TitleLevel.H3,
                }), oGitHubSection],
              }).addStyleClass("sapUiSmallMarginBegin")],
            }).addStyleClass("sapUiMediumMarginTop"), oNotice],
            endButton: new Button({
              text: "Close", press: () => {
                localStorage.setItem(`${constants.prefixId}Version`, constants.manifestVersion);
                dialog.destroy();
              },
            }),
            beginButton: new Button({
              text: constants.footer.label, press: () => window.open(constants.footer.Link, "_blank"),
            }),
          });

          // Function to update time dynamically
          const updateTime = () => {
            const now = new Date();
            const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            sap.ui.getCore().byId("utcTime").setText(`UTC Time: ${timeConvert.formatDate(utcTime)}`);
            sap.ui.getCore().byId("localTime").setText(`Local Time: ${timeConvert.formatDate(now)}`);
          };
          setInterval(updateTime, 1000);

          const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
              sap.m.MessageToast.show("Copied to clipboard!");
            }).catch(() => {
              sap.m.MessageToast.show("Failed to copy to clipboard.");
            });
          };
          dialog.open();
        }
      },
    };
  });
