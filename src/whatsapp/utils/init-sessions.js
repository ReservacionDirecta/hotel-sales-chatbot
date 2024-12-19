"use strict";
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
exports.initializeSessionsDirectory = initializeSessionsDirectory;
const promises_1 = require("fs/promises");
const path_1 = require("path");
function initializeSessionsDirectory() {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionsPath = (0, path_1.join)(process.cwd(), 'whatsapp-sessions');
        try {
            yield (0, promises_1.mkdir)(sessionsPath, { recursive: true });
            console.log('WhatsApp sessions directory created successfully');
        }
        catch (error) {
            if (error.code !== 'EEXIST') {
                console.error('Error creating WhatsApp sessions directory:', error);
                throw error;
            }
        }
        return sessionsPath;
    });
}
