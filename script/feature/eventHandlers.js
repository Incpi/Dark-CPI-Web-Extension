sap.ui.define(["powerTraceHandler","constants","codeEditor","common","formatCode","link","timeConvert","apiCall","model","sap/ui/comp/smarttable/SmartTable","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/m/Column","sap/m/ColumnListItem","sap/m/FlexItemData","sap/m/List","ExToast","sap/m/Avatar","sap/m/DateTimePicker","sap/m/Dialog","sap/m/Image","sap/m/Title","sap/m/Button","sap/m/VBox","sap/m/HBox","sap/m/MenuItem","sap/m/Menu","sap/m/Input","sap/m/StandardListItem","sap/m/Text","sap/m/Link","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/IconTabBar","sap/m/IconTabFilter","sap/m/Table","sap/ui/model/json/JSONModel","sap/m/MessageStrip","sap/m/Panel","sap/ui/core/BusyIndicator","RequestQueue"],function(powerTraceHandler,constants,CustomCodeEditor,common,CodeFormatter,link,timeConvert,apiCall,Model,SmartTable,SegmentedButton,SegmentedButtonItem,Column,ColumnListItem,FlexItemData,List,ExToast,Avatar,DateTimePicker,Dialog,Image,Title,Button,VBox,HBox,MenuItem,Menu,Input,StandardListItem,Text,Link,Toolbar,ToolbarSpacer,IconTabBar,IconTabFilter,Table,JSONModel,MessageStrip,Panel,BusyIndicator,RequestQueue) {
	"use strict";
	const createRunLogsContent = async function(messageId) {
		try {
			BusyIndicator.show(0);

			// Fetch log attachments
			const response = await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogs('${messageId}')/Attachments?$format=json`);
			const entriesList = JSON.parse(response);

			if (!entriesList.d.results || entriesList.d.results.length === 0) {
				BusyIndicator.hide();
				ExToast.show("No log attachments found.");
				return new Title({
					text:"No log attachments found.",level:sap.ui.core.TitleLevel.H3,
				});
			}

			const tabs = [];
			entriesList.d.results.sort((a,b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase()));

			for (const item of entriesList.d.results) {
				const codeEditor = new CustomCodeEditor({ fileName:`${item.MessageGuid}_${item.Name}` });
				const tab = new IconTabFilter({
					key:item.Id,text:item.Name,content:[codeEditor],
				});
				tabs.push(tab);
				// Fetch the trace content asynchronously
				apiCall
					.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogAttachments('${item.Id}')/$value`)
					.then((traceResponse) => codeEditor.setValue(traceResponse))
					.catch((err) => {
						codeEditor.setValue("Failed to fetch trace data.");
						ExToast.show("Failed to fetch trace data.");
						console.error(err);
					});
			}

			BusyIndicator.hide();

			// Create an IconTabBar for displaying the tabs
			return new IconTabBar({
				items:tabs,
			});
		} catch (error) {
			BusyIndicator.hide();
			ExToast.show("Error fetching run logs content.","error");
			console.error(error);
			return null;
		}
	};
	const createPersistLogsContent = async function(messageId) {
		try {
			BusyIndicator.show(0);
			const response = await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogs('${messageId}')/MessageStoreEntries?$format=json`);
			const entriesList = JSON.parse(response);
			// console.log(entriesList);
			if (!entriesList.d.results || entriesList.d.results.length === 0) {
				BusyIndicator.hide();
				ExToast.show("No log attachments found.");
				return new Title({
					text:"No log attachments found.",level:sap.ui.core.TitleLevel.H3,
				});
			}

			let tabs = [];
			for (const item of entriesList.d.results.sort((a,b) => (a.MessageStoreId.toLowerCase() > b.MessageStoreId.toLowerCase() ? 1 : -1))) {
				const codeEditor = new CustomCodeEditor({ fileName:`${item.MessageGuid}_${item.MessageStoreId}` });
				const propertiesTab = new IconTabFilter({ key:"properties",text:"Properties" });
				const tab = new IconTabFilter({
					key:item.Id,text:item.MessageStoreId,content:new IconTabBar({
						items:[new IconTabFilter({
							key:"log",text:"Log",content:[codeEditor],
						}),propertiesTab],
					}),
				});

				tabs.push(tab);
				apiCall
					.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageStoreEntries('${item.Id}')/$value`)
					.then((traceResponse) => codeEditor.setValue(traceResponse))
					.catch((err) => {
						codeEditor.setValue("Failed to fetch trace data.");
						ExToast.show("Failed to fetch trace data.","error");
						console.error(err);
					});
				apiCall
					.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageStoreEntries('${item.Id}')/Properties?$format=json`)
					.then((traceResponse) => propertiesTab.addContent(common.createTableFromSection({
						apiResponse:JSON.parse(traceResponse).d.results.reduce((acc,e) => ({
							...acc,[e.Name]:e.Value,
						}),{}),
					})))
					.catch((err) => {
						ExToast.show("Failed to fetch trace data.","error");
						console.error(err);
					});
			}
			BusyIndicator.hide();
			if (tabs) return new IconTabBar({ items:tabs });
		} catch (error) {
			BusyIndicator.hide();
			ExToast.show("Error fetching persist logs content.","error");
			console.error(error);
		}
	};

	async function createLogTable(messageId) {
		try {
			// Fetch response
			const response = await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogs('${messageId}')?$format=json&$expand=CustomHeaderProperties`,{ needCache:true });
			const resp = JSON.parse(response);
			const data = resp.d;
			const LogStart = common.parseSapDate(data.LogStart);
			const LogEnd = common.parseSapDate(data.LogEnd);
			// Function to convert durations
			const durations = LogEnd - LogStart;
			// Sections to display in different tables
			const sections = [{
				title:"Message Information",rows:{
					MessageGuid:data.MessageGuid,
					"Correlation Id":data.CorrelationId,
					"ApplicationMessage Id":data.ApplicationMessageId,
					"ApplicationMessage Type":data.ApplicationMessageType,
					"Start Time":LogStart,
					"End Time":LogEnd,
					"Duration in milliseconds":durations,
					"Duration in seconds":`${durations / 1000} s`,
					"Duration in minutes":`${durations / 60000} min`,
					Sender:data.Sender,
					Receiver:data.Receiver,
				},
			},{
				title:"Integration Flow Information",rows:{
					IntegrationFlowName:data.IntegrationFlowName,
					Status:data.Status,
					"Log Level":data.LogLevel,
					CustomStatus:data.CustomStatus,
				},
			},{
				title:"Component Information",rows:{
					TransactionId:data.TransactionId,
					"Previous Component Name":data.PreviousComponentName,
					"Local Component Name":data.LocalComponentName,
					"Origin Component Name":data.OriginComponentName,
				},
			}];

			// Include "Integration Artifact" if available
			if (data.IntegrationArtifact) {
				sections.push({
					title:"Integration Artifact",rows:{
						Id:data.IntegrationArtifact.Id,
						Name:data.IntegrationArtifact.Name,
						Type:data.IntegrationArtifact.Type,
						"Package Id":data.IntegrationArtifact.PackageId,
						"Package Name":data.IntegrationArtifact.PackageName,
					},
				});
			}
			return sections.map((section) => common.createTableFromSection({
				title:section.title,apiResponse:section.rows,
			}));
		} catch (error) {
			console.error("Error fetching log table data:",error);
			return [];
		}
	}

	// Set trace
	const sessionTimeouts = {}; // Global object to manage timeout IDs for each flow
	async function setTrace(status,idFlow) {
		const url = `${constants.apiBaseCPI}${constants.serviceURL.logLevel}`;
		const body = JSON.stringify({
			artifactSymbolicName:idFlow,mplLogLevel:status,nodeType:"IFLMAP",
		});
		const headers = [{ "Content-Type":"application/json" }];

		try {
			const response = await apiCall.httpReq("POST",url,{
				headers,body,CSRFToken:true,
			});
			if (response) return true;
		} catch (error) {
			ExToast.show(error.message || "An error occurred.","error");
			return false;
		}
	}

	const powerTrace = async (event) => {
		BusyIndicator.show(0);
		const button = event.getSource().setPressed(true);
		const isTrace = button.hasStyleClass("__DarkCPI_Reject");
		const idFlow = button.getModel().oData.defaultIntegrationFlowModel.allAttributes.bundleId.value;
		if (!isTrace) {
			const expirationTime = Date.now() + 10 * 60 * 1000;
			const success = await setTrace("TRACE",idFlow);
			BusyIndicator.hide();
			if (success) {
				button.addStyleClass("__DarkCPI_Reject");
				localStorage.setItem(idFlow,expirationTime);
				ExToast.show(`Log level set to TRACE.`,"success");
				// Check if there's already a timeout for this flow
				if (sessionTimeouts[idFlow]) {
					clearInterval(sessionTimeouts[idFlow]);
				}
				// Set an interval to renew the session periodically (every minute, for example)
				sessionTimeouts[idFlow] = setInterval(() => {
					const storedExpiration = parseInt(localStorage.getItem(idFlow),10);
					// console.log("Checking expiration",Date.now(),storedExpiration,Date.now() > storedExpiration);
					if (Date.now() > storedExpiration) {
						// console.log("Session expired, renewing session.");

						const renewedExpirationTime = Date.now() + (10 * 60 * 1000 - 5000);
						localStorage.setItem(idFlow,renewedExpirationTime);
						ExToast.show("TRACE session renewed.");
						setTrace("TRACE",idFlow);
					}
				},5000);
			}
		} else {
			button.removeStyleClass("__DarkCPI_Reject");
			ExToast.show("Trace will not be triggered anymore.","warning");
			if (sessionTimeouts[idFlow]) {
				clearInterval(sessionTimeouts[idFlow]);
				delete sessionTimeouts[idFlow];
			}
			BusyIndicator.hide();
			localStorage.removeItem(idFlow);
		}
	};

	function undeploy(id,tenantId) {
		console.log(id,tenantId);
		if (id && tenantId) {
			apiCall
				.httpReq("POST",constants.apiBaseCPI + constants.serviceURL.undeploy,{
					CSRFToken:true,
					headers:[{ "Content-type":"application/x-www-form-urlencoded; charset=UTF-8" }],
					body:`artifactIds=${id}&tenantId=${tenantId}`,
				})
				.then(() => {
					ExToast.show("Undeploy triggered");
					console.log("Undeploy triggered");
					return true;
				})
				.catch((e) => {
					console.error("Error triggering undeploy",e);
					ExToast.show("Error triggering undeploy","error");
					return false;
				});
		}
		return false;
	}

	const messageButton = async (event) => {
		let lastID;
		const flowId = event.getSource().getModel().oData.defaultIntegrationFlowModel.allAttributes.bundleId.value;
		let intervalId;
		let popover = sap.ui.getCore().byId(`${constants.prefixId}Popover`);
		if (!popover) {
			popover = new sap.m.Popover(`${constants.prefixId}Popover`,{
				afterClose:function() {
					clearInterval(intervalId);
					this.destroy();
				},
				showHeader:true,
				title:"DC Messages",
				placement:"Bottom",
				content:[new sap.m.Panel({ content:[new sap.m.BusyIndicator({ visible:true })] })],
				beginButton:new Button({
					tooltip:"Turn Off Inline debug.",icon:"sap-icon://wrench",text:"Off",press:() => {
						const activeButton = activeToggleButtonsByColumn.get(3);
						if (activeButton) {
							activeButton.setPressed(false);
							powerTraceHandler.hideInlineTrace();
						}
					},
				}),
			});
			popover.openBy(event.getSource());
		}
		const updatePopoverContent = async () => {
			const messages = await apiCall.fetchMessageProcessingLogs(flowId,(await RequestQueue.getData("lASTMSG")) || 10);
			if (messages.d.results.length > 0) {
				const newLastID = messages.d.results[0].MessageGuid + messages.d.results[0].LogTime.split(".")[0] + messages.d.results[0].Status;
				if (lastID !== newLastID) {
					lastID = newLastID;
					const groupedMessages = messages.d.results.reduce((acc,log) => {
						const date = log.LogDate;
						if (!acc[date]) acc[date] = [];
						acc[date].push(log);
						return acc;
					},{});
					const groupedVBox = new VBox();
					Object.entries(groupedMessages).forEach(([date,logs]) => {
						const dateHeader = new Text({
							text:date,
						}).addStyleClass("sapUiTinyMarginTop sapUiTinyMarginBegin sapUiBold sapUiTextAlignCenter");

						groupedVBox.addItem(dateHeader);

						const oButton = ({ icon,tooltip,text,press,pressed,isToggle = false,columnKey }) => {
							if (isToggle) {
								return new sap.m.ToggleButton({
									type:"Transparent",icon:icon,tooltip:tooltip,text:text,pressed,press:function(e) {
										const prevActiveButton = activeToggleButtonsByColumn.get(columnKey);
										if (prevActiveButton && prevActiveButton !== this) prevActiveButton.setPressed(false);
										activeToggleButtonsByColumn.set(columnKey,this.getPressed() ? this : null);
										press(e);
									},
								});
							}
							return new Button({
								type:"Transparent",icon:icon,tooltip:tooltip,text:text,press:press,
							});
						};

						// Define button configurations for dynamic buttons
						const buttonConfigs = [{
							tooltip:"show log viewer on this page",icon:"sap-icon://notification-2",condition:() => true, // Always show
							press:(log) => async () => {
								// await apiCall.fetchLogs(log);
								const dialog = new Model({
									id:"logs",title:"Dark CPI Panel - Logs",content:[new IconTabBar({
										selectedKey:"info",items:[new IconTabFilter({
											key:"info",text:"Info",content:await createLogTable(log.MessageGuid),
										}),new IconTabFilter({
											key:"runlogs",text:"Run Logs",content:await createRunLogsContent(log.MessageGuid),
										}),new IconTabFilter({
											key:"persist",text:"Persist",content:await createPersistLogsContent(log.MessageGuid),
										})],
									})],endButton:{ label:"Close" },verticalScrolling:true,contentWidth:"80%",contentHeight:"80%",
								});
								dialog.open();
							},
						},{
							tooltip:"show logs in new tab",icon:"sap-icon://appointment",text:null,condition:() => true, // Always show
							press:(log) => () => link.infoLog(log.MessageGuid),
						},{
							tooltip:"jump to trace page",
							text:(log) => log.LogLevel.charAt(0),
							condition:(log) => ["TRACE","INFO"].includes(log.LogLevel),
							press:(log) => async () => {
								const res = await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogs('${log.MessageGuid}')/Runs?$format=json`);
								let resp = JSON.parse(res).d.results;
								let status = resp[0].OverallState;
								let runId = resp[resp.length > 1 && status !== "COMPLETED" ? 1 : 0].Id;
								link.traceLog(log.MessageGuid,runId);
							},
						},{
							tooltip:"activate inline trace for debugging",
							icon:"sap-icon://wrench",
							isToggle:true,
							condition:(log) => log.LogLevel === "TRACE",
							press:(log) => (e) => powerTraceHandler.showInlineTrace(e,log),
						}];

						// Create the VBox containing logs
						const logsVBox = new VBox({
							items:logs.map((log) => {
								const mainButton = new Button({
									text:log.LogTime.split(".")[0],
									icon:log.status.icon,
									tooltip:"Log time",
									type:"Transparent",
									press:() => {
										let errorMessage = null;

										function createStatusContent() {
											const statusInfo = {
												status:log.Status,customStatus:log.CustomStatus,duration:log.Time,
											};
											if (log.error) {
												errorMessage = new sap.m.MessageStrip({ type:"Error",showCloseButton:false });
												errorMessage.setText(log.error);
											}

											const items = Object.entries(statusInfo).map(([key,value]) => {
												return new sap.m.StandardListItem({
													title:key,info:value,type:sap.m.ListType.None,
												}).addStyleClass(`__DarkCPI_${log.status.colorCode}`);
											});

											return new sap.m.Panel({
												content:[new sap.m.List({ items }),...(errorMessage ? [errorMessage] : [])],
											});
										}

										const oDialog = new sap.m.Popover({
											afterClose:function() {
												this.destroy();
											},
											contentWidth:log.error ? "40em" : "",
											placement:"Left",
											showHeader:false,
											title:"DC - Status",
											content:createStatusContent(),
											resizable:!!errorMessage,
										});

										oDialog.openBy(mainButton);
									},
								}).addStyleClass(`__DarkCPI_${log.status.colorCode}`);

								const dynamicButtons = buttonConfigs
									.filter((config) => config.condition(log))
									.map((config,index) => oButton({
										icon:config.icon,
										tooltip:config.tooltip,
										text:config.text ? config.text(log) : undefined,
										press:config.press(log),
										isToggle:config.isToggle,
										pressed:log.MessageGuid === $.sap.DarkCPI._settings?._trace,
										columnKey:index,
									}));

								// Combine all buttons into a single array
								const allButtons = [mainButton,...dynamicButtons];

								// Return HBox with buttons
								return new HBox({
									items:allButtons,
								}).addStyleClass("sapUiTinyMarginBeginEnd");
							}),
						});
						groupedVBox.addItem(logsVBox);
					});
					popover.removeAllContent();
					popover.addContent(groupedVBox);
				}
			} else {
				if (!lastID) {
					lastID = 1;
					popover.removeAllContent();
					popover.addContent(new Panel({
						content:[new sap.m.Text({ text:"No Data Available" }).addStyleClass("sapUiSmallMargin")],
						backgroundDesign:"Solid",
						width:"100%",
					}));
				}
			}
		};
		await updatePopoverContent();
		if (!intervalId) {
			intervalId = setInterval(async () => await updatePopoverContent(),5000);
		}
	};

	let activeToggleButtonsByColumn = new Map();
	return {
		infoButton:async (event) => {
			try {
				const dialog = new Model({
					title:"Dark CPI Panel - Information",
					content:[new sap.m.BusyIndicator({ visible:true })],
					verticalScrolling:true,
				});
				dialog.open();

				const currentFlow = event.getSource().getModel().oData.defaultIntegrationFlowModel.iFlowId;
				const traceResponse = await apiCall.httpReq("GET",constants.apiBaseCPI + constants.serviceURL.listIflow);

				if (!traceResponse) {
					console.error("No response body received");
					ExToast.show("Failed to fetch data.","error");
					return;
				}
				const parser = new DOMParser();
				const IDDoc = parser.parseFromString(traceResponse,"application/xml");
				const flowId = IDDoc.evaluate(`//artifactInformations[symbolicName='${currentFlow}']/id`,IDDoc,null,XPathResult.STRING_TYPE,null).stringValue;

				if (!flowId) {
					console.warn("Flow ID not found for the given symbolic name");
					ExToast.show("No matching artifact found.");
					return;
				}

				const apiResponseRaw = await apiCall.httpReq("GET",`${constants.apiBaseCPI + constants.serviceURL.listDetailsIflow}?artifactId=${flowId}`,{ needCache:false });
				const map = {
					deployState:"Deploy State",
					deployedBy:"Deployed By",
					deployedOn:"Deployed On",
					name:"Name",
					semanticState:"Semantic State",
					symbolicName:"Symbolic Name",
					version:"Version",
					id:"id",
					tenantId:"tenantId",
				};
				const apidatacollection = new DOMParser().parseFromString(apiResponseRaw,"application/xml");

				const {
					id,tenantId,...apiResponse
				} = Array.from(apidatacollection.querySelectorAll("* > artifactInformation >*"))
					.filter((element) => ["id","tenantId","deployState","deployedBy","deployedOn","name","semanticState","symbolicName","version"].includes(element.nodeName))
					.reduce((acc,element) => {
						const textContent = element.textContent.trim();
						if (textContent) acc[map[element.nodeName]] = textContent;
						return acc;
					},{});
				apiResponse["Active Trace"] = apidatacollection.querySelector("* > logConfiguration >traceActive").textContent;
				apiResponse["Enabled Trace"] = apidatacollection.querySelector("* > logConfiguration >traceEnabled").textContent;
				let endpoint = {};
				apidatacollection.querySelectorAll("* > endpointInformation > *").forEach((it) => {
					endpoint[it.getAttribute("endpointCategory")] = it.getAttribute("endpointUrl");
				});
				dialog.removeAllContent();
				if (Object.keys(apiResponse).length === 0) {
					console.warn("No valid data found in the response");
					dialog.addContent(new sap.m.Text({
						text:"No Data Available. Object may not be Deployed",
					}).addStyleClass("sapUiSmallMargin"));
					return;
				}
				const oTable = common.createTableFromSection({ apiResponse });
				dialog.setBeginButton(new Button({
					text:"Undeploy",press:() => undeploy(id,tenantId),
				}));
				dialog.addContent(oTable);
				if (Object.keys(endpoint).length > 0) {
					dialog.addContent(new VBox({
						items:[new Title({ text:"Endpoint Information" }),...Object.entries(endpoint).map(([label,value]) => new HBox({
							alignItems:"Center",justifyContent:"SpaceBetween",items:[new sap.m.Label({
								text:`${label}:`,width:"150px",
							}),new Text({
								text:value,wrapping:true,width:"100%",
							}),new Button({
								icon:"sap-icon://copy",tooltip:"Copy",press:() => common.copyToClipboard(value),
							})],
						}).addStyleClass("sapUiSmallMarginTop"))],
					}));
				}
			} catch (error) {
				console.error("Error occurred while fetching or processing the data:",error);
				ExToast.show("Failed to fetch trace data.","error");
			}
		},powerTrace,messageButton,
	};
});
