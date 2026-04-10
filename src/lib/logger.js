/**
 * Structured logger service with different log levels
 * Can be extended to send logs to external services like Sentry
 */

const LOG_LEVELS = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

const getTimestamp = () => new Date().toISOString();

const formatLog = (level, message, metadata = {}) => {
  return {
    timestamp: getTimestamp(),
    level,
    message,
    ...metadata,
  };
};

const logToConsole = (level, formatted) => {
  const styles = {
    DEBUG: "color: gray",
    INFO: "color: blue",
    WARN: "color: orange",
    ERROR: "color: red",
  };

  const style = styles[level] || "";
  console.log(`%c[${level}]`, style, formatted.message, formatted);
};

export const logger = {
  /**
   * Debug level logging - verbose information for diagnostics
   */
  debug: (message, metadata = {}) => {
    if (process.env.NODE_ENV === "development") {
      const formatted = formatLog(LOG_LEVELS.DEBUG, message, metadata);
      logToConsole(LOG_LEVELS.DEBUG, formatted);
    }
  },

  /**
   * Info level logging - general informational messages
   */
  info: (message, metadata = {}) => {
    const formatted = formatLog(LOG_LEVELS.INFO, message, metadata);
    logToConsole(LOG_LEVELS.INFO, formatted);
  },

  /**
   * Warn level logging - warning messages about potentially harmful situations
   */
  warn: (message, metadata = {}) => {
    const formatted = formatLog(LOG_LEVELS.WARN, message, metadata);
    logToConsole(LOG_LEVELS.WARN, formatted);
  },

  /**
   * Error level logging - error messages
   * This should be sent to error tracking services like Sentry
   */
  error: (message, metadata = {}) => {
    const formatted = formatLog(LOG_LEVELS.ERROR, message, metadata);
    logToConsole(LOG_LEVELS.ERROR, formatted);

    // TODO: Send to external error tracking service (e.g., Sentry)
    // Sentry.captureException(new Error(message), { ...metadata });
  },

  /**
   * Log user actions for audit trail
   */
  audit: (action, details = {}) => {
    const formatted = formatLog("AUDIT", action, {
      action,
      timestamp: getTimestamp(),
      ...details,
    });
    logToConsole("AUDIT", formatted);
    // TODO: Send to audit logging database
  },

  /**
   * Log security-related events
   */
  security: (event, details = {}) => {
    const formatted = formatLog("SECURITY", event, {
      event,
      timestamp: getTimestamp(),
      ...details,
    });
    logToConsole("SECURITY", formatted);
    // TODO: Send to security event log
  },
};
