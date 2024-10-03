/**
 * Provides a customizable logging utility with different log levels.
 *
 * The `Logger` class allows you to set the log level and log messages at different
 * levels of severity, such as `DEBUG`, `INFO`, `WARN`, and `ERROR`. The logged
 * messages are prefixed with a timestamp and the log level.
 *
 * Logs a message to the console with the specified log level.
 * @param {string} level - The log level (e.g. 'info', 'warn', 'error').
 * @param {string} message - The message to log.
 * @param {...any} [args] - Additional arguments to pass to the console log function.
 * Custom developed By @INCPI - <Omkar Patel>. to ensure no risk is involved...
 */
"use strict";
class Logger {
  constructor(name = "", log = 1) {
    this.name = name;
    this.LOG_LEVELS = {
      LOG: { level: 0, color: "\x1b[32m" }, // Green
      INFO: { level: 1, color: "\x1b[0m" }, // Reset color
      WARN: { level: 2, color: "\x1b[33m" }, // Yellow
      ERROR: { level: 3, color: "\x1b[31m" }, // Red
      DEBUG: { level: 4, color: "\x1b[34m" }, // Blue
    };
    this.logLevel = this.LOG_LEVELS[Object.keys(this.LOG_LEVELS)[log]] || this.LOG_LEVELS.LOG;
  }

  setLogLevel(level) {
    this.logLevel = level;
  }

  debug(message, ...args) {
    const lineNumber = this.getLineNumber();
    this.print(message, this.LOG_LEVELS.DEBUG, lineNumber, args);
  }

  info(message, ...args) {
    const lineNumber = this.getLineNumber();
    this.print(message, this.LOG_LEVELS.INFO, lineNumber, args);
  }

  warn(message, ...args) {
    const lineNumber = this.getLineNumber();
    this.print(message, this.LOG_LEVELS.WARN, lineNumber, args);
  }

  error(message, ...args) {
    const lineNumber = this.getLineNumber();
    this.print(message, this.LOG_LEVELS.ERROR, lineNumber, args);
  }

  log(message, ...args) {
    const lineNumber = this.getLineNumber();
    this.print(message, this.LOG_LEVELS.LOG, lineNumber, args);
  }

  getLineNumber() {
    try {
      throw new Error();
    } catch (e) {
      const stackLines = e.stack.split("\n");
      const callerStackLine = stackLines[3] || stackLines[4];
      const match = callerStackLine.match(/at\s+(.*?):(\d+):(\d+)/);
      if (match) {
        const fileName = match[1].split("/").pop();
        return `${fileName}:${match[2]}`;
      } else {
        return "unknown";
      }
    }
  }

  print(message, levelObj, lineNumber, args) {
    if (levelObj.level >= this.logLevel.level) {
      const timestamp = new Date().toISOString();
      const fullMessage = `${levelObj.color} ${this.name} [${timestamp}] ${message} (at ${lineNumber})\x1b[0m`; // Reset color after the message
      console.log(fullMessage, ...args);
    }
  }
}
