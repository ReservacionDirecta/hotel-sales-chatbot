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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigController = void 0;
const common_1 = require("@nestjs/common");
let ConfigController = (() => {
    let _classDecorators = [(0, common_1.Controller)('api/config')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getAIProviders_decorators;
    let _updateAIApiKey_decorators;
    var ConfigController = _classThis = class {
        constructor(aiConfigService) {
            this.aiConfigService = (__runInitializers(this, _instanceExtraInitializers), aiConfigService);
        }
        getAIProviders() {
            try {
                const defaultProvider = this.aiConfigService.defaultProvider;
                const geminiConfig = this.aiConfigService.getProviderConfig('gemini');
                return {
                    defaultProvider,
                    providers: {
                        gemini: {
                            name: 'Google Gemini',
                            isConfigured: !!geminiConfig.apiKey,
                            model: geminiConfig.model,
                        },
                        // Espacio para futuros proveedores
                    },
                };
            }
            catch (error) {
                console.error('Error getting AI providers:', error);
                throw new common_1.BadRequestException('Error al obtener proveedores de IA');
            }
        }
        updateAIApiKey(body) {
            try {
                if (!body.provider || !body.apiKey) {
                    throw new common_1.BadRequestException('Proveedor y API key son requeridos');
                }
                this.aiConfigService.updateApiKey(body.provider, body.apiKey);
                return { success: true, message: 'API key actualizada exitosamente' };
            }
            catch (error) {
                console.error('Error updating API key:', error);
                throw new common_1.BadRequestException('Error al actualizar API key');
            }
        }
    };
    __setFunctionName(_classThis, "ConfigController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getAIProviders_decorators = [(0, common_1.Get)('ai/providers')];
        _updateAIApiKey_decorators = [(0, common_1.Post)('ai/apikey')];
        __esDecorate(_classThis, null, _getAIProviders_decorators, { kind: "method", name: "getAIProviders", static: false, private: false, access: { has: obj => "getAIProviders" in obj, get: obj => obj.getAIProviders }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateAIApiKey_decorators, { kind: "method", name: "updateAIApiKey", static: false, private: false, access: { has: obj => "updateAIApiKey" in obj, get: obj => obj.updateAIApiKey }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConfigController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConfigController = _classThis;
})();
exports.ConfigController = ConfigController;
