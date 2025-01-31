sap.ui.define(["formatCode","sap/m/Button","ExToast"],function(CodeFormatter,Button,ExToast) {
	"use strict";
	const createTableFromSection = ({ title = null,apiResponse }) => {
		const rows = Object.entries(apiResponse)
			.filter(([key,value]) => typeof value !== "object")
			.map(([key,value]) => ({ Name:key,Value:value }));
		// Create the JSON model for the table
		const oModel = new sap.ui.model.json.JSONModel({ rows });
		// Create the table
		const oTable = new sap.ui.table.Table({
			title:title, // Table title
			visibleRowCount:rows.length,
			selectionMode:sap.ui.table.SelectionMode.None,
			columns:[
				new sap.ui.table.Column({
					label:new sap.ui.commons.Label({ text:"Name",design:"Bold" }),
					template:new sap.m.Text({
						text:"{Name}",
						wrapping:true, // Enables wrapping for long text
					}),
					sortProperty:"Name",
					filterProperty:"Name",
				}),
				new sap.ui.table.Column({
					label:new sap.ui.commons.Label({ text:"Value",design:"Bold" }),
					template:new sap.m.Text({
						text:"{Value}",
						wrapping:true, // Enables wrapping for long text
					}),
					sortProperty:"Value",
					filterProperty:"Value",
				}),
			],
		});

		// Bind the JSON model to the table
		oTable.setModel(oModel);
		oTable.bindRows("/rows");

		return oTable;
	};

	const formatTrace = function(input,id,traceId) {
		id = id.replaceAll(":","_");
		const tabSize = 2;
		let editorManager;
		// Utility: Create a button dynamically
		const createButton = (text,onPress) => {
			return new Button({ text:text,press:onPress });
		};

		// Download Trace Archive button
		if (traceId) {
			const downloadButton = createButton("Download",async () => {
				try {
					const response = await apiCall.httpReq("GET",`/${cpiData.urlExtension}Operations/com.sap.it.op.tmn.commands.dashboard.webui.GetTraceArchiveCommand?traceIds=${traceId}`);
					const value = response.match(/<payload>(.*)<\/payload>/gs)[0];
					const base64Data = value.substring(9,value.length - 10);
					window.open(`data:application/zip;base64,${base64Data}`);
					ExToast.show("Download complete.");
				} catch (error) {
					ExToast.show("Failed to download trace archive.","error");
					console.error(error);
				}
			});
			this.getView().byId("buttonContainer").addItem(downloadButton);
		}

		// Download Body button
		const downloadBodyButton = createButton("Download Body",() => {
			const typeOfInput = prettify_type(input);
			downloadFile(input,typeOfInput,`CPI_${traceId}_${id}`);
			ExToast.show("Download of body is complete.");
		});
		this.getView().byId("buttonContainer").addItem(downloadBodyButton);

		// Copy button
		const copyButton = createButton("Copy",() => {
			const unformattedText = this.getView().byId(`cpiHelper_traceText_unformatted_${id}`);
			const text = unformattedText.hasStyleClass("cpiHelper_traceText_active") ? unformattedText.getText() : editorManager.getContent();
			copyText(text);
			ExToast.show("Content copied.");
		});
		this.getView().byId("buttonContainer").addItem(copyButton);

		// Read-Only toggle button
		const readonlyButton = createButton("Edit",() => {
			const isReadOnly = editorManager.toggleReadOnly();
			readonlyButton.setText(isReadOnly ? "Read Only" : "Edit");
		});
		this.getView().byId("buttonContainer").addItem(readonlyButton);

		// Beautify button
		const beautifyButton = createButton("Beautify",() => {
			const unformattedText = this.getView().byId(`cpiHelper_traceText_unformatted_${id}`);
			const formattedText = this.getView().byId(`cpiHelper_traceText_formatted_${id}`);

			const isUnformattedActive = unformattedText.hasStyleClass("cpiHelper_traceText_active");
			unformattedText.toggleStyleClass("cpiHelper_traceText_active",!isUnformattedActive);
			formattedText.toggleStyleClass("cpiHelper_traceText_active",isUnformattedActive);

			beautifyButton.setText(isUnformattedActive ? "Linearize" : "Beautify");

			if (!formattedText.getText().trim()) {
				editorManager = new EditorManager(`cpiHelper_traceText_formatted_${id}`,prettify_type(input),this.getView().byId("cpihelperglobal").hasStyleClass("ch_dark") ? "github_dark" : "textmate");
				editorManager.setContent(prettify(input,tabSize));
			}
		});
		this.getView().byId("buttonContainer").addItem(beautifyButton);
	};

	const copyToClipboard = (text) => {
		navigator.clipboard
			.writeText(text)
			.then(() => ExToast.show("Copied to clipboard!"))
			.catch(() => ExToast.show("Failed to copy to clipboard.","error"));
	};
	const escapeHTML = (input) => {
		if (input == null) return ""; // Handle null/undefined safely
		if (typeof input !== "string") input = String(input); // Convert non-string values

		const htmlEntities = {
			"&":"&amp;",
			"<":"&lt;",
			">":"&gt;",
			"\"":"&quot;",
			"'":"&#039;",
			"/":"&#x2F;",
			"`":"&#x60;",
			"=":"&#x3D;",
		};

		return input.replace(/[&<>"'`=\/]/g,(char) => htmlEntities[char]);
	};

	function debounce(func,delay) {
		let timeout;
		return function(...args) {
			clearTimeout(timeout); // Clear the previous timeout
			timeout = setTimeout(() => func.apply(this,args),delay); // Set a new timeout
		};
	}

	return {
		debounce,
		escapeHTML,
		formatTrace,
		copyToClipboard,
		createTableFromSection,
		parseSapDate:(sapDate) => new Date(parseInt(sapDate.replaceAll(/\D+/g,""))),
		getStatusAttributes:function(status) {
			const sharedAttributes = {
				warning:"Attention",
				negative:"Reject",
				positive:"Accept",
				info:"Neutral",
				grey:"Default",
			};
			const sharedIcons = {
				begin:"sap-icon://begin",
				accept:"sap-icon://accept",
				decline:"sap-icon://decline",
				redo:"sap-icon://redo",
				cancel:"sap-icon://cancel",
				exclamation:"sap-icon://message-warning",
			};
			// const buttonType = ["Accept", "Attention", "Back", "Critical", "Default", "Emphasized", "Ghost", "Negative", "Neutral", "Reject", "Success", "Transparent", "Unstyled", "Up"]
			const statusMap = {
				PROCESSING:{ colorCode:sharedAttributes.warning,icon:sharedIcons.begin },
				STARTING:{ colorCode:sharedAttributes.warning,icon:sharedIcons.begin },
				FAILED:{ colorCode:sharedAttributes.negative,icon:sharedIcons.decline },
				COMPLETED:{ colorCode:sharedAttributes.positive,icon:sharedIcons.accept },
				DEPLOYED:{ colorCode:sharedAttributes.positive,icon:sharedIcons.accept },
				STORED:{ colorCode:sharedAttributes.positive,icon:sharedIcons.accept },
				ESCALATED:{ colorCode:sharedAttributes.warning,icon:sharedIcons.exclamation },
				RETRY:{ colorCode:sharedAttributes.warning,icon:sharedIcons.redo },
				CANCELLED:{ colorCode:sharedAttributes.info,icon:sharedIcons.cancel },
				ABANDONED:{ colorCode:sharedAttributes.info,icon:sharedIcons.cancel },
			};
			return statusMap[status] || { colorCode:sharedAttributes.grey,icon:"" };
		},
	};
});
