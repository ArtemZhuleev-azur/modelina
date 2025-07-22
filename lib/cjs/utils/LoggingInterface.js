"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LoggerClass = void 0;
/**
 * Logger class for the model generation library
 *
 * This class acts as a forefront for any external loggers which is why it also implements the interface itself.
 */
class LoggerClass {
    constructor() {
        this.logger = undefined;
    }
    debug(message, ...optionalParams) {
        if (this.logger) {
            this.logger.debug(message, ...optionalParams);
        }
    }
    info(message, ...optionalParams) {
        if (this.logger) {
            this.logger.info(message, ...optionalParams);
        }
    }
    warn(message, ...optionalParams) {
        if (this.logger) {
            this.logger.warn(message, ...optionalParams);
        }
    }
    error(message, ...optionalParams) {
        if (this.logger) {
            this.logger.error(message, ...optionalParams);
        }
    }
    /**
     * Sets the logger to use for the model generation library
     *
     * @param logger to add
     */
    setLogger(logger) {
        this.logger = logger;
    }
}
exports.LoggerClass = LoggerClass;
exports.Logger = new LoggerClass();
//# sourceMappingURL=LoggingInterface.js.map