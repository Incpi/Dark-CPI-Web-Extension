sap.ui.define([], function () {
  "use strict";

  /**
   * Formats XML with proper indentation.
   * @param {string} sourceXml - The XML string to format.
   * @returns {string} - The formatted XML string.
   */
  function formatXml(sourceXml) {
    try {
      const xmlDeclarationMatch = sourceXml.match(/^<\?xml.*\?>/);
      const xmlDeclaration = xmlDeclarationMatch ? `${xmlDeclarationMatch[0]}\n` : "";
      let filterFlag = false;

      let xmlDoc = new DOMParser().parseFromString(sourceXml, "application/xml");
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        xmlDoc = new DOMParser().parseFromString(`<Dark_CPI>${sourceXml}</Dark_CPI>`, "application/xml");
        filterFlag = true;
      }

      const xsltDoc = new DOMParser().parseFromString(
        [
          '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">',
          '  <xsl:strip-space elements="*"/>',
          '  <xsl:template match="node()|@*">',
          '    <xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>',
          "  </xsl:template>",
          '  <xsl:output method="xml" indent="yes" omit-xml-declaration="no"/>',
          "</xsl:stylesheet>",
        ].join("\n"),
        "application/xml"
      );

      const xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsltDoc);
      const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
      let resultXml = new XMLSerializer().serializeToString(resultDoc);

      if (filterFlag) {
        resultXml = resultXml.substring(10, resultXml.length - 11).replace(/\n\s{2}/g, "\n");
      }

      return xmlDeclaration + resultXml;
    } catch (error) {
      console.error("Error formatting XML:", error);
      return sourceXml;
    }
  }

  /**
   * Determines the type of the input content.
   * @param {string} input - The input string to analyze.
   * @returns {string} - The type of the input: "xml", "json", "sql", or "text".
   */
  function determineType(input) {
    const trimmedInput = input.trim();
    if (trimmedInput.startsWith("<")) {
      return "xml";
    }
    if (trimmedInput.startsWith("{") || trimmedInput.startsWith("[")) {
      return "json";
    }

    const sqlOccurrence = trimmedInput
      .substring(0, 100)
      .toLowerCase()
      .match(/select|from|where|update|insert|upsert|create table|union|join|values|group by/gm)?.length;

    if ((sqlOccurrence && sqlOccurrence >= 2) || (trimmedInput.startsWith("--") && sqlOccurrence >= 1) || trimmedInput.startsWith("--sql")) {
      return "sql";
    }

    return "text";
  }

  /**
   * Prettifies the input string based on its type.
   * @param {string} input - The input string to prettify.
   * @param {number} [tabSize=2] - The number of spaces to use for indentation.
   * @returns {Object} - An object containing the type and prettified code.
   */
  function prettify(input, tabSize = 2) {
    try {
      const type = determineType(input);
      let code;

      if (type === "json") {
        code = JSON.stringify(JSON.parse(input), null, Math.max(tabSize, 2));
      } else if (type === "xml") {
        code = formatXml(input);
      } else {
        code = input; // Return as-is for unsupported types
      }

      return { type, code };
    } catch (error) {
      console.error("Error during prettification:", error);
      return { type: "text", code: input }; // Return input unmodified on failure
    }
  }

  return { prettify };
});
