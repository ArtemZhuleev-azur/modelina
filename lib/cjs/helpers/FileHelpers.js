"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileHelpers = void 0;
const fs_1 = require("fs");
const path = __importStar(require("path"));
/**
 * Convert a string into utf-8 encoding and return the byte size.
 */
function lengthInUtf8Bytes(str) {
    // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
    const m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}
class FileHelpers {
    /**
     * Node specific file writer, which writes the content to the specified filepath.
     *
     * This function is invasive, as it overwrite any existing files with the same name as the model.
     *
     * @param content to write
     * @param filePath to write to,
     * @param ensureFilesWritten veryify that the files is completely written before returning, this can happen if the file system is swamped with write requests.
     */
    static writerToFileSystem(content, filePath, ensureFilesWritten = false) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const outputFilePath = path.resolve(filePath);
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                yield fs_1.promises.mkdir(path.dirname(outputFilePath), { recursive: true });
                // eslint-disable-next-line security/detect-non-literal-fs-filename
                yield fs_1.promises.writeFile(outputFilePath, content);
                /**
                 * It happens that the promise is resolved before the file is actually written to.
                 *
                 * This often happen if the file system is swamped with write requests in either benchmarks
                 *
                 * To avoid this we dont resolve until we are sure the file is written and exists.
                 */
                if (ensureFilesWritten) {
                    // eslint-disable-next-line no-undef
                    const timerId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                        try {
                            // eslint-disable-next-line security/detect-non-literal-fs-filename
                            const isExists = yield fs_1.promises.stat(outputFilePath);
                            if (isExists && isExists.size === lengthInUtf8Bytes(content)) {
                                // eslint-disable-next-line no-undef
                                clearInterval(timerId);
                                resolve();
                            }
                        }
                        catch (e) {
                            // Ignore errors here as the file might not have been written yet
                        }
                    }), 10);
                }
                else {
                    resolve();
                }
            }
            catch (e) {
                reject(e);
            }
        }));
    }
}
exports.FileHelpers = FileHelpers;
//# sourceMappingURL=FileHelpers.js.map