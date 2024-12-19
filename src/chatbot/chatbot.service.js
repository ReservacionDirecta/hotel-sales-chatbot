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
exports.ChatbotService = void 0;
const common_1 = require("@nestjs/common");
let ChatbotService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ChatbotService = _classThis = class {
        constructor(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ChatbotService.name);
            this.conversationStages = new Map();
        }
        getActiveScript(type) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const script = yield this.prisma.salesScript.findFirst({
                        where: {
                            type,
                            active: true,
                        },
                        orderBy: {
                            updatedAt: 'desc',
                        },
                    });
                    return (script === null || script === void 0 ? void 0 : script.content) || null;
                }
                catch (error) {
                    this.logger.error(`Error getting ${type} script:`, error);
                    return null;
                }
            });
        }
        determineStage(message, currentStage) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!currentStage) {
                    return { stage: 'greeting', step: 1 };
                }
                // Palabras clave para detectar etapas
                const keywords = {
                    greeting: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos'],
                    qualification: ['precio', 'costo', 'tarifa', 'habitación', 'disponibilidad'],
                    presentation: ['detalles', 'servicios', 'instalaciones', 'fotos', 'imágenes'],
                    objection: ['caro', 'lejos', 'mejor', 'competencia', 'descuento'],
                    closing: ['reservar', 'confirmar', 'pagar', 'depósito', 'agendar'],
                    followup: ['gracias', 'confirmar', 'recibo', 'confirmación'],
                };
                const messageLower = message.toLowerCase();
                // Detectar etapa basada en palabras clave
                for (const [stage, words] of Object.entries(keywords)) {
                    if (words.some(word => messageLower.includes(word))) {
                        return {
                            stage: stage,
                            step: 1,
                        };
                    }
                }
                // Si no se detecta una nueva etapa, avanzar en la etapa actual
                return {
                    stage: currentStage.stage,
                    step: currentStage.step + 1,
                };
            });
        }
        processMessage(message, conversationId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let currentStage = conversationId ? this.conversationStages.get(conversationId) : undefined;
                    const newStage = yield this.determineStage(message, currentStage);
                    if (conversationId) {
                        this.conversationStages.set(conversationId, newStage);
                    }
                    // Obtener el script correspondiente a la etapa
                    const script = yield this.getActiveScript(newStage.stage);
                    if (script) {
                        return script;
                    }
                    // Respuestas por defecto si no hay script
                    const defaultResponses = {
                        greeting: '¡Bienvenido! ¿En qué puedo ayudarte con tu reserva de hotel?',
                        qualification: 'Tenemos diferentes tipos de habitaciones disponibles. ¿Qué tipo de habitación estás buscando?',
                        presentation: 'Nuestro hotel cuenta con excelentes instalaciones y servicios de primera clase.',
                        objection: 'Entiendo tu preocupación. ¿Podría contarte más sobre el valor que ofrecemos?',
                        closing: '¿Te gustaría proceder con la reserva?',
                        followup: 'Gracias por tu interés. ¿Hay algo más en lo que pueda ayudarte?',
                    };
                    return defaultResponses[newStage.stage] || '¿En qué más puedo ayudarte?';
                }
                catch (error) {
                    this.logger.error('Error processing message:', error);
                    return 'Lo siento, hubo un error. Por favor, intenta nuevamente.';
                }
            });
        }
        findOrCreateConversation(whatsappId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let conversation = yield this.prisma.conversation.findFirst({
                        where: { whatsappId }
                    });
                    if (!conversation) {
                        conversation = yield this.prisma.conversation.create({
                            data: {
                                whatsappId,
                                userId: whatsappId,
                                status: 'active'
                            }
                        });
                    }
                    return conversation;
                }
                catch (error) {
                    this.logger.error('Error finding or creating conversation:', error);
                    throw error;
                }
            });
        }
    };
    __setFunctionName(_classThis, "ChatbotService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatbotService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatbotService = _classThis;
})();
exports.ChatbotService = ChatbotService;
