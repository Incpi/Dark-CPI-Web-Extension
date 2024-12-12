sap.ui.loader.config({ paths: { "constants": `${$.sap.chromeExtensionURL}utils/constants` } });

sap.ui.define(["constants", "sap/m/BusyDialog", "sap/m/Dialog", "sap/m/Image", "sap/m/Title", "sap/m/Button", "sap/m/VBox", "sap/m/HBox", "sap/m/StandardListItem", "sap/m/Text", "sap/m/Link", "sap/m/Toolbar", "sap/m/ToolbarSpacer", "sap/m/MessageStrip"], function(constants, BusyDialog, Dialog, Image, Title, Button, VBox, HBox, StandardListItem, Text, Link, Toolbar, ToolbarSpacer, MessageStrip) {
  "use strict";
  let localtheme = () => localStorage.getItem(`${constants.prefixId}Theme`) || "sap_horizon";
  console.log("Start eventHandler script");
  return {
    new_theme: () => {
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
        if (record !== {} || !record) {
          return new MessageStrip(record).addStyleClass("sapUiMediumMarginTop");
        }
      });

      function mode(number) {
        let theme = constants.cpithemes[number].name;
        sap.ui.getCore().applyTheme(theme);
        sap.ui.getCore().byId(`${constants.prefixId}ExtButton`).setIcon(theme !== "sap_horizon_dark" ? "sap-icon://light-mode" : "sap-icon://dark-mode");
        localStorage.setItem(`${constants.prefixId}Theme`, theme);
        sap.m.MessageToast.show(constants.cpithemes[number].buttonlabel + " Theme applied");
      }

      let dialog = sap.ui.getCore().byId(`${constants.prefixId}usedListDialog`);

      if (!dialog) {
        const dialog = new Dialog({
          title: `What's New in Dark CPI v ${constants.manifestVersion}`,
          contentWidth: "50%",
          contentHeight: "70%",
          verticalScrolling: true,
          content: [new HBox({
            items: [new Image({
              src: `${$.sap.chromeExtensionURL}images/icon128.png`,
              height: "100px",
              decorative: false,
              alt: "Company Logo",
            }), new VBox({
              items: [new Title({
                text: "Choose Theme:", level: sap.ui.core.TitleLevel.H3,
              }), new HBox({
                items: Object.entries(constants.cpithemes).map(([key, theme]) => new Button({
                    text: theme.buttonlabel, press: () => mode(key), tooltip: `Switch to ${theme.label} theme`,
                  })
                    .addStyleClass("sapUiTinyMarginBeginEnd").addStyleClass(`${constants.prefixId}themeButton`), // Apply SAPUI5 margin class
                ), justifyContent: "SpaceAround", // Space between buttons
              }).addStyleClass("sapUiTinyMargin")],
            })],
          }), new VBox({
            items: Object.entries(constants.data_update_label).map(([sectionKey, sectionTitle]) => {
              const items = constants.data_updates[sectionKey] || [];
              if (items && items.length > 0) {
                return new VBox({
                  items: [new Title({
                    text: sectionTitle, level: sap.ui.core.TitleLevel.H3,
                  }), new sap.m.List({
                    items: items.map(item => new StandardListItem({
                      title: item.description, type: sap.m.ListType.Inactive, wrap: true,
                    })),
                  })],
                }).addStyleClass("sapUiTinyMarginTop");
              }
            }),
          }).addStyleClass("sapUiMediumMarginTop"),


            new VBox({
              items: [new VBox({
                items: [new Title({
                  text: "Github Contacts", level: sap.ui.core.TitleLevel.H3,
                }), oGitHubSection, oNotice], // Ensure spacing between elements
                height: "100%",
              })],
            }).addStyleClass("sapUiMediumMarginTop")],
          endButton: new sap.m.Button({
            text: "Close", press: () => {
              localStorage.setItem(`${constants.prefixId}Version`, constants.manifestVersion);
              dialog.close();
            },
          }),
          beginButton: new sap.m.Button({
            text: constants.footer.label, press: () => window.open(constants.footer.Link, "_blank"),
          }),
        });
        dialog.open();
      }
    },
  };
});