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
exports.ConversationController = void 0;
const common_1 = require("@nestjs/common");
let ConversationController = (() => {
    let _classDecorators = [(0, common_1.Controller)('hotel/conversations')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _findAll_decorators;
    let _findOne_decorators;
    let _searchConversations_decorators;
    let _create_decorators;
    let _update_decorators;
    let _updateStatus_decorators;
    let _addMessage_decorators;
    let _sendMessage_decorators;
    var ConversationController = _classThis = class {
        constructor(conversationService) {
            this.conversationService = (__runInitializers(this, _instanceExtraInitializers), conversationService);
        }
        findAll() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversations = yield this.conversationService.findAll();
                    return {
                        success: true,
                        data: conversations || [],
                        message: conversations.length === 0 ? 'No hay conversaciones disponibles' : 'Conversaciones obtenidas exitosamente'
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al obtener las conversaciones',
                        data: []
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        findOne(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversation = yield this.conversationService.findOne(id);
                    if (!conversation) {
                        throw new common_1.HttpException('Conversación no encontrada', common_1.HttpStatus.NOT_FOUND);
                    }
                    return {
                        success: true,
                        data: conversation,
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al obtener la conversación',
                        data: []
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        searchConversations(searchQuery) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!searchQuery) {
                    return yield this.conversationService.findAll();
                }
                return yield this.conversationService.searchConversations(searchQuery);
            });
        }
        create(createConversationDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversation = yield this.conversationService.create(createConversationDto);
                    return {
                        success: true,
                        data: conversation,
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al crear la conversación',
                        data: []
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        update(id, updateConversationDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const conversation = yield this.conversationService.update(id, updateConversationDto);
                    return {
                        success: true,
                        data: conversation,
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al actualizar la conversación',
                        data: []
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        updateStatus(id, updateConversationDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log(`Updating conversation ${id} status to:`, updateConversationDto);
                    const conversation = yield this.conversationService.update(id, updateConversationDto);
                    return {
                        success: true,
                        data: conversation,
                        message: 'Estado de conversación actualizado exitosamente'
                    };
                }
                catch (error) {
                    console.error('Error updating conversation status:', error);
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al actualizar el estado de la conversación',
                        data: null
                    }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        addMessage(id, createMessageDto) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a;
                try {
                    console.log('Received message DTO:', JSON.stringify(createMessageDto));
                    const message = yield this.conversationService.createMessage(id, createMessageDto);
                    return {
                        success: true,
                        data: message,
                    };
                }
                catch (error) {
                    console.error('Error in addMessage:', error);
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al agregar el mensaje',
                        data: [],
                        validationErrors: (_a = error.response) === null || _a === void 0 ? void 0 : _a.message
                    }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
        sendMessage(id, createMessageDto) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const message = yield this.conversationService.sendMessage(id, createMessageDto);
                    return {
                        success: true,
                        data: message,
                    };
                }
                catch (error) {
                    throw new common_1.HttpException({
                        success: false,
                        message: error.message || 'Error al enviar el mensaje',
                        data: []
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }
    };
    __setFunctionName(_classThis, "ConversationController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _searchConversations_decorators = [(0, common_1.Get)('search')];
        _create_decorators = [(0, common_1.Post)()];
        _update_decorators = [(0, common_1.Put)(':id')];
        _updateStatus_decorators = [(0, common_1.Patch)(':id')];
        _addMessage_decorators = [(0, common_1.Post)(':id/messages')];
        _sendMessage_decorators = [(0, common_1.Post)(':id/send-message')];
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: obj => "findOne" in obj, get: obj => obj.findOne }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _searchConversations_decorators, { kind: "method", name: "searchConversations", static: false, private: false, access: { has: obj => "searchConversations" in obj, get: obj => obj.searchConversations }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStatus_decorators, { kind: "method", name: "updateStatus", static: false, private: false, access: { has: obj => "updateStatus" in obj, get: obj => obj.updateStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addMessage_decorators, { kind: "method", name: "addMessage", static: false, private: false, access: { has: obj => "addMessage" in obj, get: obj => obj.addMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendMessage_decorators, { kind: "method", name: "sendMessage", static: false, private: false, access: { has: obj => "sendMessage" in obj, get: obj => obj.sendMessage }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConversationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConversationController = _classThis;
})();
exports.ConversationController = ConversationController;
