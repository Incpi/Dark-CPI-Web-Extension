sap.ui.define(["constants","codeEditor","common","apiCall","model","ExToast"],function(constants,CustomCodeEditor,common,apiCall,Model,ExToast) {
	let onClicKElements = [];
	let activeInlineItem = null;
	let observerInstalled = false;
	let inlineTraceElements;

	const hideInlineTrace = async (destroy = true) => {
		if (destroy) $.sap.DarkCPI._settings._trace = null;
		activeInlineItem = null;
		onClicKElements.forEach((el) => (el.onclick = null));
		onClicKElements = [];
		const classes = ["DC_active","DC_error","DC_PT"];
		const elements = new Set(document.querySelectorAll(".DC_PT"));
		elements.forEach((el) => {
			el.onclick = null;
			classes.forEach((cls) => el.classList.remove(cls));
		});
	};

	async function getMessageProcessingLogRuns(MessageGuid) {
		try {
			const baseUrl = `${constants.apiBaseCPI}${constants.serviceURL.apiv1}`;
			const runsRes = await apiCall.httpReq("GET",`${baseUrl}/MessageProcessingLogs('${MessageGuid}')/Runs?$format=json&$top=200`,{ needCache:false });
			const { results } = JSON.parse(runsRes).d;
			if (!results.length) return null;

			const runId = results[results.length > 1 && !["COMPLETED","ESCALATED"].includes(results[0].OverallState) ? 1 : 0].Id;
			const stepsRes = await apiCall.httpReq("GET",`${baseUrl}/MessageProcessingLogRuns('${runId}')/RunSteps?$format=json&$top=300`,{ needCache:false });

			return JSON.parse(stepsRes).d.results.filter((e) => e.StepStop);
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	function getChild(node,childNames,childClass = null) {
		return [...node.children].findIndex((child) => childNames.includes(child.localName) && (!childClass || child.classList.contains(childClass)));
	}

	async function createInlineTraceElements(MessageGuid) {
		const logRuns = await getMessageProcessingLogRuns(MessageGuid);
		if (!logRuns?.length) return 0;

		inlineTraceElements = logRuns.map(({ StepId,ModelStepId,ChildCount,StepStop,StepStart,RunId,BranchId,Error }) => ({
			StepId,
			ModelStepId,
			ChildCount,
			StepStop,
			StepStart,
			RunId,
			BranchId,
			Error,
		}));
		return logRuns.length;
	}

	async function showInlineTrace(event,log) {
		if (!event.getSource().getPressed()) return await hideInlineTrace();
		$.sap.DarkCPI._settings._trace = log.MessageGuid;
		await hideInlineTrace(false);
		if (!(await createInlineTraceElements(log.MessageGuid))) return null;

		// console.log(inlineTraceElements);

		inlineTraceElements.forEach((run) => {
			try {
				let element = document.getElementById(`BPMNShape_${run.StepId}`) || document.getElementById(`BPMNEdge_${run.ModelStepId}`);
				if (!element) return console.warn(`No element found for ${run.ModelStepId}`);

				let target = element.children[0]?.children[0] || element.children[getChild(element,["g"])]?.children[0];
				if (!target) return;
				if (/MessageFlow_\d+/.test(run.ModelStepId) && /#/.test(run.ModelStepId) !== true) {
					element = document.getElementById("BPMNEdge_" + run.ModelStepId);
					target = element.children[getChild(element,["text"],"shapeText")];
				}
				target.classList.add("DC_PT");
				element.classList.add("DC_click");
				element.onclick = () => init(log,run);
				onClicKElements.push(element);

				if (run.Error) target.classList.add("DC_error");

				if (!observerInstalled) {
					observerInstalled = true;
					observer = new MutationObserver((mutations) => {
						if (mutations.some((m) => !m.target.classList.contains("DC_click"))) {
							hideInlineTrace();
							observer.disconnect();
						}
					});
					observer.observe(element,{ attributes:true,attributeFilter:["class"] });
				}
			} catch (e) {
				console.error(`No element found for ${run.ModelStepId}`,e);
			}
		});

		return true;
	}

	const init = async (log,run) => {
		const response = await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogs('${log.MessageGuid}')?$format=json`);
		const logleveldata = JSON.parse(response).d;
		if (logleveldata.LogLevel !== "TRACE") {
			return ExToast.show("Trace is not enabled",`Your log level is ${logleveldata.LogLevel}`,"warning");
		}
		const traceExpiry = new Date(parseInt(logleveldata.LogEnd.replace(/\D/g,"")) + 1.05 * 60 * 60000);
		if (traceExpiry < new Date()) {
			return ExToast.show("Trace is expired\",\"1 hour is already passed","warning");
		}
		const panel = new sap.m.Panel({
			content:[new sap.m.Text({ text:"Loading content..." })],
		});
		const branchCodeList =
			inlineTraceElements
				.reduce((acc,item) => {
					acc[item.ModelStepId] = acc[item.ModelStepId] || [];
					acc[item.ModelStepId].push(item);
					return acc;
				},{})
				[run.ModelStepId]?.sort((a,b) => Number(a.BranchId) - Number(b.BranchId)) || [];
		if (!branchCodeList.length) return;
		// Dynamically include "Error" trace type if run.Error exists
		const objects = [
			{
				label:"Properties",
				traceType:"properties",
				url:"/ExchangeProperties?$format=json",
			},
			{ label:"Headers",traceType:"headers",url:"/Properties?$format=json" },
			{
				label:"Body",
				traceType:"trace",
				url:"/$value",
			},
			{ label:"Error",traceType:"error",errorMessage:run.Error }, // Add the Error entry conditionally
		];
		// Remove the error tab from the array if there's no error
		if (!run.Error) {
			objects.pop();
		}
		// Function to update panel content dynamically
		const updatePanelContent = () => {
			const selectedBranch = branchCodeList.find((b) => b.BranchId === branchCodeButton.getSelectedKey()) || branchCodeList[0];
			const selectedObject = objects.find((o) => o.traceType === segmentedButton.getSelectedKey()) || objects[0];
			// console.log(selectedBranch, selectedObject);
			if (selectedBranch && selectedObject) {
				getTraceTabContent(selectedObject,selectedBranch,panel);
			}
		};
		// Branch selection buttons
		const branchCodeButton = new sap.m.SegmentedButton({
			width:"100%",
			select:updatePanelContent,
			selectedKey:branchCodeList[0].BranchId,
			items:branchCodeList.map(
				(branch) =>
					new sap.m.SegmentedButtonItem({
						text:branch.BranchId,
						tooltip:"",
						key:branch.BranchId,
					}),
			),
		});
		// Object selection buttons (including the "Error" tab if run.Error exists)
		const segmentedButton = new sap.m.SegmentedButton({
			width:"100%",
			selectedKey:objects[0].traceType,
			select:updatePanelContent,
			items:objects.map((obj) => new sap.m.SegmentedButtonItem({ text:obj.label,tooltip:"",key:obj.traceType })),
		});
		updatePanelContent();
		const dialog = new Model({
			title:"Dark CPI - Content Before Step",
			content:[branchCodeList.length > 1 ? branchCodeButton : null,segmentedButton,panel].filter(Boolean), // Remove any null or undefined values from the content array
			contentWidth:"100%",
			contentHeight:"85%",
		});

		dialog.open();
	};
	const getTraceTabContent = async (object,run,panel) => {
		panel.removeAllContent();
		try {
			// Fetch trace data
			const traceData = JSON.parse(await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/MessageProcessingLogRunSteps(RunId='${run.RunId}',ChildCount=${run.ChildCount})/TraceMessages?$format=json`)).d.results;
			const trace = traceData.sort((a,b) => a.TraceId - b.TraceId)[0];
			// If no trace found, show a warning and return
			if (!trace) {
				ExToast.show("It is already deleted or not in trace mode.","No trace exists","warning");
				return panel.addContent(new sap.m.Text({ text:"No trace for this step exists, it is already deleted or not in trace mode." }));
			}
			const traceId = trace.TraceId;
			panel.setHeaderText(`Trace Tab Content - ${object.label}`);
			console.info(object);
			if (object.traceType === "error" && run.Error) {
				const editor = new CustomCodeEditor({});
				panel.addContent(editor);
				editor.setValue(run.Error);
				return;
			}
			if (object.url) {
				try {
					const data = await apiCall.httpReq("GET",`${constants.apiBaseCPI}${constants.serviceURL.apiv1}/TraceMessages(${traceId})${object.url}`);
					// If no data received, show a message saying no data is available
					if (!data) {
						panel.addContent(new sap.m.Text({ text:"No information associated with this trace." }));
						return;
					}
					// If the URL is for $value (custom editor)
					if (object.url === "/$value") {
						const editor = new CustomCodeEditor({});
						panel.addContent(editor);
						editor.setValue(data);
					} else {
						// If there are results, create a table from the data
						const apiResponse = JSON.parse(data).d.results.reduce((acc,e) => {
							acc[e.Name] = e.Value;
							return acc;
						},{});
						panel.addContent(common.createTableFromSection({ apiResponse }));
					}
				} catch (err) {
					ExToast.show("Failed to fetch trace data.");
					panel.addContent(new sap.m.Text({ text:"Error loading content." }));
					console.error(err);
				}
			} else {
				panel.addContent(new sap.m.Text({ text:"No additional content available for this trace." }));
			}
		} catch (err) {
			ExToast.show("Failed to fetch trace information.");
			panel.addContent(new sap.m.Text({ text:"Error loading trace data." }));
			console.error(err);
		}
	};

	return { showInlineTrace,hideInlineTrace,init };
});
