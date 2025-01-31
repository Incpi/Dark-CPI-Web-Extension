sap.ui.define(["constants", "common", "timeConvert"], function (constants, common, timeConvert) {
  "use strict";

  const getCSRFToken = async (url) => {
    if (constants.allowedCPI.test(url)) url = constants.apiBaseCPI + "/api/1.0/user";
    try {
      const response = await fetch(url, { method: "GET", headers: { "X-CSRF-Token": "fetch" } });
      // console.log(response,url);
      if (!response.ok) throw { status: response.status, errorMessage: "Error fetching CSRF token." };

      const CSRFToken = response.headers.get("X-CSRF-Token");
      if (!CSRFToken) throw { status: response.status, errorMessage: "CSRFToken not found." };
      return CSRFToken;
    } catch (error) {
      throw error;
    }
  };
  const cache = new Map();
  // CSRFToken needed to true main in PUT,POST
  const httpReq = async (
    method,
    url,
    {
      headers = [],
      body = null,
      CSRFToken = false,
      needCache = true,
      cachetime = 120,
    } = {}
  ) => {
    const cacheKey = JSON.stringify({ url, method, headers, body, CSRFToken });
    const currentTime = Date.now();

    if (cache.has(cacheKey) && needCache) {
      const cachedData = cache.get(cacheKey);
      if (currentTime - cachedData.timestamp < cachedData.validationtime) {
        return cachedData.response;
      } else {
        cache.delete(cacheKey);
      }
    }

    let fetchHeaders = {};
    headers.forEach((header) => Object.assign(fetchHeaders, header));

    if (CSRFToken) {
      try {
        fetchHeaders["X-CSRF-Token"] = await getCSRFToken(url);
      } catch (err) {
        throw new Error(`Failed to fetch CSRF token: ${err.message}`);
      }
    }

    try {
      const response = await fetch(url, { method, headers: fetchHeaders, body });
      if (!response.ok) {
        throw { status: response.status, errorMessage: `Error: ${response.statusText}` };
      }

      const responseBody = await response.text();
      cache.set(cacheKey, { response: responseBody, timestamp: currentTime, validationtime: cachetime * 1000 });
      return responseBody;
    } catch (error) {
      throw error;
    }
  };

  const User = async () => {
    try {
      const url = `${constants.apiBaseCPI}${constants.serviceURL.apiUser}`;
      const response = await httpReq("GET", url, { cachetime: 1000 });
      return String(JSON.parse(response)[0].Name);
    } catch {
      return null;
    }
  };

  const fetchMessageProcessingLogs = async (integrationFlowId, RESULTS_LIMIT = 50) => {
    const BASE_URL = `${constants.apiBaseCPI}${constants.serviceURL.apiv1}`;
    const LOG_INFO_URL = constants.serviceURL.logInfo;
    // console.log(integrationFlowId);
    // Helper function to format elapsed time into human-readable format
    const formatElapsedTime = (milliseconds) => {
      if (milliseconds < 1000) {
        return `${milliseconds} ms`;
      } else if (milliseconds < 60000) {
        return `${(milliseconds / 1000).toFixed(2)} s`;
      } else {
        return `${(milliseconds / 60000).toFixed(2)} m`;
      }
    };

    // Helper function to fetch error details for a failed message
    const fetchErrorDetails = async (messageGuid) => {
      const response = await httpReq("GET", `${constants.apiBaseCPI}${LOG_INFO_URL}?messageGuid=${messageGuid}`);
      const parser = new DOMParser();
      const xml = parser.parseFromString(response, "application/xml");
      const errorNode = xml.querySelector("lastError");
      return errorNode ? errorNode.textContent : null;
    };

    const logsUrl = `${BASE_URL}/MessageProcessingLogs?$select=AlternateWebLink,MessageGuid,CustomStatus,LogStart,LogEnd,Status,LogLevel&$filter=IntegrationArtifact/Id eq '${integrationFlowId}' and LogStart gt datetime'1900-01-01T01:02:50' and Status ne 'DISCARDED'&$orderby=LogEnd desc&$format=json&$top=${RESULTS_LIMIT}`;
    // /Runs
    let responseJson = {};

    try {
      const response = await httpReq("GET", logsUrl, { needCache: false });
      responseJson = JSON.parse(response);

      // Using forEach to iterate over each message in results
      for (const message of responseJson.d.results) {
        // Parse and format log times
        const logStart = common.parseSapDate(message.LogStart);
        const logEnd = common.parseSapDate(message.LogEnd);
        message.status = { Status: message.Status, ...common.getStatusAttributes(message.Status) };
        // Calculate and format elapsed time
        const elapsedTime = logEnd - logStart;
        message.Time = formatElapsedTime(elapsedTime);
        message.LogDate = timeConvert.formatDateTime(logEnd).date.replaceAll("/", "-");
        message.LogTime = timeConvert.formatDateTime(logEnd).time;

        if (message.Status === "FAILED") {
          message.error = await fetchErrorDetails(message.MessageGuid);
        }
      }
    } catch (error) {
      console.error("Error fetching message processing logs:", error);
    }
    return responseJson;
  };

  return { getCSRFToken, httpReq, User, fetchMessageProcessingLogs };
});
