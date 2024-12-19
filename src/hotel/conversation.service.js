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
exports.ConversationService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ConversationService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ConversationService = _classThis = class {
        constructor(prisma, geminiService) {
            this.prisma = prisma;
            this.geminiService = geminiService;
        }
        findAll() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversations = yield this.prisma.conversation.findMany({
                        include: {
                            messages: {
                                orderBy: {
                                    timestamp: 'asc'
                                },
                                select: {
                                    id: true,
                                    content: true,
                                    sender: true,
                                    messageType: true,
                                    timestamp: true,
                                    messageId: true
                                }
                            },
                        },
                        orderBy: {
                            updatedAt: 'desc',
                        },
                    });
                    return conversations;
                }
                catch (error) {
                    console.error('Error en findAll:', error);
                    throw new Error('Error al obtener las conversaciones de la base de datos');
                }
            });
        }
        findOne(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversation = yield this.prisma.conversation.findUnique({
                        where: { id },
                        include: {
                            messages: {
                                orderBy: {
                                    timestamp: 'asc'
                                },
                                select: {
                                    id: true,
                                    content: true,
                                    sender: true,
                                    messageType: true,
                                    timestamp: true,
                                    messageId: true
                                }
                            },
                        },
                    });
                    if (!conversation) {
                        throw new common_1.NotFoundException(`Conversación con ID ${id} no encontrada`);
                    }
                    return conversation;
                }
                catch (error) {
                    if (error instanceof common_1.NotFoundException) {
                        throw error;
                    }
                    throw new Error(`Error al obtener la conversación: ${error.message}`);
                }
            });
        }
        create(createConversationDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    return yield this.prisma.conversation.create({
                        data: {
                            userId: createConversationDto.userId,
                            whatsappId: createConversationDto.whatsappId || createConversationDto.userId,
                            status: 'active',
                        },
                        include: {
                            messages: true,
                        },
                    });
                }
                catch (error) {
                    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                        if (error.code === 'P2002') {
                            throw new Error('Ya existe una conversación con este ID de WhatsApp');
                        }
                    }
                    throw new Error(`Error al crear la conversación: ${error.message}`);
                }
            });
        }
        update(id, updateConversationDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('Updating conversation:', { id, data: updateConversationDto });
                    // Validate status
                    const validStatuses = ['active', 'closed', 'archived'];
                    if (updateConversationDto.status && !validStatuses.includes(updateConversationDto.status)) {
                        throw new Error(`Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`);
                    }
                    const conversation = yield this.prisma.conversation.update({
                        where: { id },
                        data: Object.assign(Object.assign({}, updateConversationDto), { updatedAt: new Date() }),
                        include: {
                            messages: {
                                orderBy: {
                                    timestamp: 'asc'
                                }
                            },
                        },
                    });
                    if (!conversation) {
                        throw new common_1.NotFoundException(`Conversación con ID ${id} no encontrada`);
                    }
                    return conversation;
                }
                catch (error) {
                    console.error('Error updating conversation:', error);
                    if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                        if (error.code === 'P2025') {
                            throw new common_1.NotFoundException(`Conversación con ID ${id} no encontrada`);
                        }
                    }
                    throw error;
                }
            });
        }
        getMessageHistory(conversationId, limit) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const messages = yield this.prisma.message.findMany({
                        where: {
                            conversationId: conversationId
                        },
                        orderBy: {
                            timestamp: 'desc'
                        },
                        take: limit || undefined,
                        select: {
                            id: true,
                            content: true,
                            sender: true,
                            messageType: true,
                            timestamp: true,
                            messageId: true
                        }
                    });
                    return messages.reverse(); // Devolvemos en orden cronológico
                }
                catch (error) {
                    console.error('Error al obtener historial de mensajes:', error);
                    throw new Error(`Error al obtener el historial de mensajes: ${error.message}`);
                }
            });
        }
        createMessage(conversationId, createMessageDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log('Creating message for conversation:', conversationId, 'Message:', createMessageDto);
                    // Verify conversation exists
                    const conversation = yield this.findOne(conversationId);
                    if (!conversation) {
                        throw new common_1.NotFoundException(`Conversation ${conversationId} not found`);
                    }
                    // Create user message first
                    const message = yield this.prisma.message.create({
                        data: {
                            content: createMessageDto.content,
                            sender: createMessageDto.sender || 'user',
                            messageType: createMessageDto.messageType || 'text',
                            messageId: `msg_${Date.now()}`,
                            conversation: {
                                connect: {
                                    id: conversationId
                                }
                            }
                        },
                    });
                    console.log('User message created:', message);
                    // If the message is from the user, generate AI response
                    if (createMessageDto.sender !== 'assistant') {
                        console.log('Generating AI response for user message');
                        const conversationHistory = conversation.messages.map(msg => `${msg.sender}: ${msg.content}`);
                        console.log('Requesting AI response with conversation history');
                        const aiResponse = yield this.geminiService.generateHotelResponse(createMessageDto.content, conversationHistory);
                        console.log('AI response received:', aiResponse ? 'success' : 'failed');
                        // Create AI response message
                        if (aiResponse) {
                            const botMessage = yield this.prisma.message.create({
                                data: {
                                    content: aiResponse,
                                    sender: 'assistant',
                                    messageType: 'text',
                                    messageId: `bot_${Date.now()}`,
                                    conversation: {
                                        connect: {
                                            id: conversationId
                                        }
                                    }
                                },
                            });
                            console.log('Bot message created:', botMessage.id);
                            // Return both messages
                            return {
                                userMessage: message,
                                botMessage: botMessage
                            };
                        }
                    }
                    // Update conversation timestamp
                    yield this.prisma.conversation.update({
                        where: { id: conversationId },
                        data: { updatedAt: new Date() },
                    });
                    return { userMessage: message };
                }
                catch (error) {
                    console.error('Error in createMessage:', error);
                    throw new Error(`Error al crear el mensaje: ${error.message}`);
                }
            });
        }
        sendMessage(conversationId, createMessageDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Obtener el historial reciente para contexto
                    const recentMessages = yield this.getMessageHistory(conversationId, 5);
                    // Guardamos el mensaje del usuario
                    const userMessage = yield this.createMessage(conversationId, Object.assign(Object.assign({}, createMessageDto), { sender: 'user', timestamp: new Date() }));
                    // No necesitamos generar una respuesta automática ya que se genera en createMessage
                    return {
                        userMessage,
                        context: recentMessages
                    };
                }
                catch (error) {
                    console.error('Error en sendMessage:', error);
                    throw new Error(`Error al procesar el mensaje: ${error.message}`);
                }
            });
        }
        searchConversations(searchQuery) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversations = yield this.prisma.conversation.findMany({
                        where: {
                            OR: [
                                {
                                    userId: {
                                        contains: searchQuery
                                    }
                                },
                                {
                                    messages: {
                                        some: {
                                            content: {
                                                contains: searchQuery
                                            }
                                        }
                                    }
                                },
                                {
                                    whatsappId: {
                                        contains: searchQuery
                                    }
                                }
                            ]
                        },
                        include: {
                            messages: {
                                orderBy: {
                                    timestamp: 'asc'
                                },
                                select: {
                                    id: true,
                                    content: true,
                                    sender: true,
                                    messageType: true,
                                    timestamp: true,
                                    messageId: true
                                }
                            },
                        },
                        orderBy: {
                            updatedAt: 'desc',
                        },
                    });
                    return conversations;
                }
                catch (error) {
                    console.error('Error searching conversations:', error);
                    throw new Error(`Error al buscar conversaciones: ${error.message}`);
                }
            });
        }
    };
    __setFunctionName(_classThis, "ConversationService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConversationService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConversationService = _classThis;
})();
exports.ConversationService = ConversationService;
