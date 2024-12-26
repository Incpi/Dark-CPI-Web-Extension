sap.ui.loader.config({ paths: { constants: `${$.sap.chromeExtensionURL}utils/js/constants` } });

sap.ui.define(["constants"], function(constants) {
  "use strict";

  const getCSRFToken = async (url) => {
    if (constants.allowedCPI.test(url)) url = constants.apiBaseURLCPI + "/api/1.0/user";

    try {
      const response = await fetch(url, { method: "GET", headers: { "X-CSRF-Token": "fetch" } });
      if (!response.ok) throw { status: response.status, errorMessage: "Error fetching CSRF token." };

      const CSRFToken = response.headers.get("X-CSRF-Token");
      if (!CSRFToken) throw { status: response.status, errorMessage: "CSRFToken not found." };
      return CSRFToken;
    } catch (error) {
      throw error;
    }
  };
  const cache = new Map();

  const httpReq = async (url, method, headers = [], body = null, CSRFToken = false) => {
    const cacheKey = JSON.stringify({ url, method, headers, body, CSRFToken });
    const currentTime = Date.now();

    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      if (currentTime - cachedData.timestamp < 120000) { // Cache valid for 120 seconds
        return cachedData.response;
      } else {
        // Remove expired cache entry
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

      const responseBody = await response.text(); // Adjust if you expect JSON
      const responseData = { status: response.status, body: responseBody };

      cache.set(cacheKey, { response: responseData, timestamp: currentTime });

      return responseData;
    } catch (error) {
      throw error;
    }
  };


  const User = async () => {
    try {
      const url = `${constants.apiBaseCPI}/api/1.0/user`;
      const response = await httpReq(url, "GET", [], null, false);
      return String(JSON.parse(response.body)[0].Name);
    } catch {
      return null;
    }
  };
  return { getCSRFToken, httpReq, User };
});
