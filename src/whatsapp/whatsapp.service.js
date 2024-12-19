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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const whatsapp_web_js_1 = require("whatsapp-web.js");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
let WhatsappService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WhatsappService = _classThis = class {
        constructor(chatbotService, eventEmitter) {
            this.chatbotService = chatbotService;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(WhatsappService.name);
            this.isInitializing = false;
            this._isConnected = false;
            this.qrCode = null;
            this.qrAttempts = 0;
            this.maxQrAttempts = 5;
            this.sessionBasePath = path.join(process.cwd(), 'whatsapp-sessions');
            this.sessionDir = path.join(this.sessionBasePath, 'session-hotel-sales-bot');
            this.ensureSessionDirectory();
        }
        ensureSessionDirectory() {
            if (!fs.existsSync(this.sessionBasePath)) {
                fs.mkdirSync(this.sessionBasePath, { recursive: true });
            }
        }
        onModuleInit() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.initialize();
            });
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.isInitializing) {
                    this.logger.warn('WhatsApp client is already initializing');
                    return;
                }
                this.isInitializing = true;
                try {
                    // Limpiar cliente existente si existe
                    if (this.client) {
                        try {
                            yield this.client.destroy();
                            yield new Promise(resolve => setTimeout(resolve, 2000));
                        }
                        catch (error) {
                            this.logger.warn('Error destroying previous client:', error);
                        }
                        this.client = null;
                    }
                    // Reiniciar contadores y estados
                    this.qrAttempts = 0;
                    this.qrCode = null;
                    this._isConnected = false;
                    const clientOptions = {
                        authStrategy: new whatsapp_web_js_1.LocalAuth({
                            clientId: 'hotel-sales-bot',
                            dataPath: this.sessionBasePath
                        }),
                        puppeteer: {
                            headless: true,
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-sandbox',
                                '--disable-dev-shm-usage',
                                '--disable-accelerated-2d-canvas',
                                '--no-first-run',
                                '--no-zygote',
                                '--disable-gpu',
                                '--disable-extensions',
                                '--disable-background-networking',
                                '--disable-default-apps',
                                '--disable-sync'
                            ],
                            handleSIGINT: false,
                            handleSIGTERM: false,
                            handleSIGHUP: false,
                            defaultViewport: null,
                            ignoreHTTPSErrors: true
                        }
                    };
                    this.client = new whatsapp_web_js_1.Client(clientOptions);
                    this.setupClientListeners();
                    try {
                        yield this.client.initialize();
                        this.logger.log('WhatsApp client initialized successfully');
                    }
                    catch (initError) {
                        this.logger.error('Detailed initialization error:', initError);
                        // Additional retry logic
                        if (this.qrAttempts < this.maxQrAttempts) {
                            this.qrAttempts++;
                            this.logger.warn(`Retrying initialization (Attempt ${this.qrAttempts})`);
                            yield this.initialize();
                        }
                        else {
                            this.logger.error('Max initialization attempts reached');
                            throw initError;
                        }
                    }
                }
                catch (error) {
                    this.logger.error('Comprehensive WhatsApp client initialization error:', error);
                    // Optionally, you can implement a retry mechanism or reset browser context here
                    throw error;
                }
                finally {
                    this.isInitializing = false;
                }
            });
        }
        setupClientListeners() {
            this.client.on('qr', (qr) => {
                this.logger.log('QR Code received');
                this.qrCode = qr;
                this.qrAttempts++;
                if (this.qrAttempts >= this.maxQrAttempts) {
                    this.logger.warn('Max QR attempts reached, reinitializing client...');
                    this.initialize();
                }
            });
            this.client.on('ready', () => {
                this.logger.log('WhatsApp client is ready!');
                this._isConnected = true;
                this.qrCode = null;
                this.qrAttempts = 0;
                this.eventEmitter.emit('whatsapp.connected');
            });
            this.client.on('authenticated', () => {
                this.logger.log('WhatsApp client authenticated');
            });
            this.client.on('auth_failure', (error) => {
                this.logger.error('WhatsApp authentication failed:', error);
                this._isConnected = false;
                this.initialize();
            });
            this.client.on('disconnected', (reason) => {
                this.logger.warn('WhatsApp client disconnected:', reason);
                this._isConnected = false;
                this.eventEmitter.emit('whatsapp.disconnected');
                this.initialize();
            });
            this.client.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                this.logger.log(`New message from ${message.from}: ${message.body}`);
                try {
                    // Buscar o crear la conversación primero
                    let conversation = yield this.chatbotService.findOrCreateConversation(message.from);
                    // Emitir evento para que el sistema de conversaciones lo maneje
                    this.eventEmitter.emit('whatsapp.message.received', {
                        from: message.from,
                        content: message.body,
                        timestamp: message.timestamp,
                        type: message.type,
                        conversationId: conversation.id // Añadir el ID de la conversación
                    });
                    // Procesar el mensaje con el chatbot
                    const response = yield this.chatbotService.processMessage(message.body, conversation.id.toString());
                    if (response) {
                        yield message.reply(response);
                        this.logger.log(`Sent response to ${message.from}`);
                    }
                }
                catch (error) {
                    this.logger.error('Error processing message:', error);
                }
            }));
        }
        disconnect() {
            return __awaiter(this, void 0, void 0, function* () {
                this.logger.log('Attempting to disconnect WhatsApp client...');
                if (this.client) {
                    try {
                        yield this.client.destroy();
                        this._isConnected = false;
                        this.logger.log('WhatsApp client disconnected successfully');
                    }
                    catch (error) {
                        this.logger.error('Error disconnecting WhatsApp client:', error);
                        throw error;
                    }
                }
            });
        }
        getConnectionStatus() {
            return __awaiter(this, void 0, void 0, function* () {
                return {
                    isConnected: this._isConnected,
                    qrCode: this.qrCode,
                    qrAttempts: this.qrAttempts,
                    maxAttempts: this.maxQrAttempts
                };
            });
        }
        generateQR() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this._isConnected) {
                    throw new Error('WhatsApp ya está conectado');
                }
                // Si el cliente no está inicializado o está desconectado, reiniciamos la conexión
                if (!this.client || !this._isConnected) {
                    yield this.resetConnection();
                }
                // Esperamos hasta que se genere un código QR o se conecte
                let attempts = 0;
                const maxWaitAttempts = 30; // 30 segundos máximo de espera
                while (!this.qrCode && !this._isConnected && attempts < maxWaitAttempts) {
                    yield new Promise(resolve => setTimeout(resolve, 1000));
                    attempts++;
                }
                if (this._isConnected) {
                    return {
                        status: 'connected',
                        qr: null,
                        attempts: this.qrAttempts
                    };
                }
                if (!this.qrCode) {
                    throw new Error('No se pudo generar el código QR');
                }
                return {
                    status: this._isConnected ? 'connected' : 'disconnected',
                    qr: this.qrCode,
                    attempts: this.qrAttempts
                };
            });
        }
        sendMessage(to, message) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!this._isConnected) {
                    throw new Error('WhatsApp client is not connected');
                }
                try {
                    const formattedNumber = this.formatPhoneNumber(to);
                    yield this.client.sendMessage(`${formattedNumber}@c.us`, message);
                    return { success: true, message: 'Message sent successfully' };
                }
                catch (error) {
                    this.logger.error('Error sending WhatsApp message:', error);
                    return { success: false, error: error.message };
                }
            });
        }
        formatPhoneNumber(phone) {
            return phone.replace(/[^0-9]/g, '');
        }
        resetConnection() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.disconnect();
                    yield this.initialize();
                }
                catch (error) {
                    this.logger.error('Error resetting connection:', error);
                    throw error;
                }
            });
        }
    };
    __setFunctionName(_classThis, "WhatsappService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WhatsappService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WhatsappService = _classThis;
})();
exports.WhatsappService = WhatsappService;
