"use strict";
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
exports.GeminiService = void 0;
const common_1 = require("@nestjs/common");
const generative_ai_1 = require("@google/generative-ai");
let GeminiService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GeminiService = _classThis = class {
        constructor(aiConfigService, roomRepository, salesScriptRepository, hotelInfoRepository) {
            this.aiConfigService = aiConfigService;
            this.roomRepository = roomRepository;
            this.salesScriptRepository = salesScriptRepository;
            this.hotelInfoRepository = hotelInfoRepository;
            this.initializeGemini();
        }
        initializeGemini() {
            try {
                const config = this.aiConfigService.getProviderConfig('gemini');
                if (!config || !config.apiKey) {
                    console.error('Gemini API key not configured. Please check your .env file.');
                    return;
                }
                this.genAI = new generative_ai_1.GoogleGenerativeAI(config.apiKey);
                this.model = this.genAI.getGenerativeModel({
                    model: config.model || 'gemini-pro',
                    generationConfig: {
                        temperature: config.temperature || 0.7,
                        maxOutputTokens: config.maxTokens || 1000,
                    }
                });
                console.log('Gemini API initialized successfully');
            }
            catch (error) {
                console.error('Error initializing Gemini API:', error);
                throw new Error('Failed to initialize Gemini API. Please check your configuration.');
            }
        }
        getAvailableRooms() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.roomRepository.find({
                    where: { available: true },
                    order: { price: 'ASC' }
                });
            });
        }
        getRelevantScripts(messageType) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.salesScriptRepository.find({
                    where: { type: messageType, isActive: true }
                });
            });
        }
        getHotelInfo() {
            return __awaiter(this, void 0, void 0, function* () {
                const hotelInfo = yield this.hotelInfoRepository.findOne({
                    where: { id: 1 } // Assuming we only have one hotel info record
                });
                if (!hotelInfo) {
                    throw new Error('Hotel information not configured');
                }
                return hotelInfo;
            });
        }
        generateResponse(prompt_1) {
            return __awaiter(this, arguments, void 0, function* (prompt, context = '') {
                try {
                    if (!this.model) {
                        this.initializeGemini();
                        if (!this.model) {
                            throw new Error('No se pudo inicializar la API de Gemini. Por favor, verifica tu configuración.');
                        }
                    }
                    const fullPrompt = context ? `${context}\n\nUser: ${prompt}` : prompt;
                    console.log('Sending prompt to Gemini:', fullPrompt);
                    const result = yield this.model.generateContent(fullPrompt);
                    const response = yield result.response;
                    return response.text();
                }
                catch (error) {
                    console.error('Error generating Gemini response:', error);
                    throw new Error('Error al generar respuesta: ' + error.message);
                }
            });
        }
        generateHotelResponse(prompt_1) {
            return __awaiter(this, arguments, void 0, function* (prompt, conversationHistory = []) {
                try {
                    console.log('Generating hotel response for prompt:', prompt);
                    // Get all necessary information
                    const [hotelInfo, availableRooms, relevantScripts] = yield Promise.all([
                        this.getHotelInfo(),
                        this.getAvailableRooms(),
                        this.getRelevantScripts(this.determineMessageType(prompt))
                    ]);
                    // Format room information for better readability
                    const formattedRooms = availableRooms.map(room => ({
                        tipo: room.type,
                        precio: `$${room.price}`,
                        descripcion: room.description
                    }));
                    const systemContext = `
      Eres un asistente de ventas de hotel profesional y amable. Usa esta información para responder:

      INFORMACIÓN DEL HOTEL:
      Nombre: ${hotelInfo.name}
      Descripción: ${hotelInfo.description}
      Ubicación: ${hotelInfo.address}, ${hotelInfo.city}, ${hotelInfo.country}
      Contacto: ${hotelInfo.phone} | ${hotelInfo.email}
      Amenidades: ${hotelInfo.amenities.join(', ')}

      HABITACIONES DISPONIBLES:
      ${JSON.stringify(formattedRooms, null, 2)}

      GUÍAS DE RESPUESTA:
      ${relevantScripts.map(script => script.content).join('\n')}
      
      Historial de conversación:
      ${conversationHistory.join('\n')}
      
      Instrucciones:
      1. Responde siempre en español
      2. Sé amable y profesional
      3. Proporciona información precisa sobre el hotel y las habitaciones
      4. Si no sabes algo, dilo honestamente
      5. Menciona las habitaciones disponibles y precios cuando sea relevante
      6. Usa un tono conversacional pero profesional
      7. Si el cliente muestra interés, ofrece ayuda para hacer la reserva
      8. Mantén las respuestas concisas pero informativas

      Mensaje del cliente: ${prompt}
      Asistente:`;
                    console.log('System context prepared, calling Gemini API...');
                    const response = yield this.generateResponse(prompt, systemContext);
                    console.log('Gemini response received:', response ? 'success' : 'failed');
                    return response;
                }
                catch (error) {
                    console.error('Error generating hotel response:', error);
                    return 'Lo siento, estoy teniendo problemas técnicos. ¿Podrías intentar reformular tu pregunta?';
                }
            });
        }
        determineMessageType(prompt) {
            const promptLower = prompt.toLowerCase();
            if (promptLower.includes('hola') || promptLower.includes('buenos') || promptLower.includes('saludos')) {
                return 'greeting';
            }
            if (promptLower.includes('precio') || promptLower.includes('costo') || promptLower.includes('tarifa')) {
                return 'pricing';
            }
            if (promptLower.includes('reserv') || promptLower.includes('book')) {
                return 'booking';
            }
            if (promptLower.includes('habitacion') || promptLower.includes('cuarto') || promptLower.includes('room')) {
                return 'room_info';
            }
            if (promptLower.includes('ubicacion') || promptLower.includes('direccion') || promptLower.includes('donde')) {
                return 'location';
            }
            if (promptLower.includes('gracias') || promptLower.includes('adios') || promptLower.includes('hasta luego')) {
                return 'closing';
            }
            return 'general';
        }
    };
    __setFunctionName(_classThis, "GeminiService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        GeminiService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return GeminiService = _classThis;
})();
exports.GeminiService = GeminiService;
