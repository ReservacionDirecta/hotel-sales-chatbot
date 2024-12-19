"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
let WhatsappController = (() => {
    let _classDecorators = [(0, common_1.Controller)('hotel/whatsapp')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getStatus_decorators;
    let _sendMessage_decorators;
    let _resetConnection_decorators;
    let _generateQR_decorators;
    let _disconnect_decorators;
    var WhatsappController = _classThis = class {
        constructor(whatsappService) {
            this.whatsappService = (__runInitializers(this, _instanceExtraInitializers), whatsappService);
        }
        getStatus() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const status = yield this.whatsappService.getConnectionStatus();
                    return {
                        success: true,
                        data: status
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error al obtener el estado de WhatsApp: ' + error.message,
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        sendMessage(messageDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const result = yield this.whatsappService.sendMessage(messageDto.to, messageDto.message);
                    return {
                        success: true,
                        data: result
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error al enviar mensaje: ' + error.message,
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        resetConnection() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.whatsappService.resetConnection();
                    return {
                        success: true,
                        message: 'Conexión reiniciada exitosamente'
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error al reiniciar la conexión: ' + error.message,
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        generateQR() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const qrData = yield this.whatsappService.generateQR();
                    return {
                        success: true,
                        data: qrData
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error al generar código QR: ' + error.message,
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        disconnect() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.whatsappService.disconnect();
                    return {
                        success: true,
                        message: 'Desconectado exitosamente'
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Error al desconectar: ' + error.message,
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
    };
    __setFunctionName(_classThis, "WhatsappController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getStatus_decorators = [(0, common_1.Get)('status')];
        _sendMessage_decorators = [(0, common_1.Post)('message')];
        _resetConnection_decorators = [(0, common_1.Post)('reset')];
        _generateQR_decorators = [(0, common_1.Post)('qr')];
        _disconnect_decorators = [(0, common_1.Post)('disconnect')];
        __esDecorate(_classThis, null, _getStatus_decorators, { kind: "method", name: "getStatus", static: false, private: false, access: { has: obj => "getStatus" in obj, get: obj => obj.getStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendMessage_decorators, { kind: "method", name: "sendMessage", static: false, private: false, access: { has: obj => "sendMessage" in obj, get: obj => obj.sendMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resetConnection_decorators, { kind: "method", name: "resetConnection", static: false, private: false, access: { has: obj => "resetConnection" in obj, get: obj => obj.resetConnection }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateQR_decorators, { kind: "method", name: "generateQR", static: false, private: false, access: { has: obj => "generateQR" in obj, get: obj => obj.generateQR }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _disconnect_decorators, { kind: "method", name: "disconnect", static: false, private: false, access: { has: obj => "disconnect" in obj, get: obj => obj.disconnect }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WhatsappController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WhatsappController = _classThis;
})();
exports.WhatsappController = WhatsappController;
