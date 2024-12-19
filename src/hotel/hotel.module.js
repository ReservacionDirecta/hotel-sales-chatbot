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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const hotel_controller_1 = require("./hotel.controller");
const hotel_service_1 = require("./hotel.service");
const conversation_controller_1 = require("./conversation.controller");
const conversation_service_1 = require("./conversation.service");
const gemini_service_1 = require("./gemini.service");
const prisma_module_1 = require("../prisma/prisma.module");
const ai_service_1 = require("../config/ai.service");
const typeorm_1 = require("@nestjs/typeorm");
const room_entity_1 = require("./entities/room.entity");
const hotel_entity_1 = require("./entities/hotel.entity");
const hotel_info_entity_1 = require("./entities/hotel-info.entity");
const conversation_entity_1 = require("./entities/conversation.entity");
const message_entity_1 = require("./entities/message.entity");
const sales_script_entity_1 = require("./entities/sales-script.entity");
const room_service_1 = require("./services/room.service");
const sales_script_service_1 = require("./services/sales-script.service");
const room_controller_1 = require("./controllers/room.controller");
const sales_script_controller_1 = require("./controllers/sales-script.controller");
const seed_service_1 = require("./services/seed.service");
let HotelModule = (() => {
    let _classDecorators = [(0, common_1.Module)({
            imports: [
                prisma_module_1.PrismaModule,
                config_1.ConfigModule,
                typeorm_1.TypeOrmModule.forFeature([hotel_entity_1.Hotel, hotel_info_entity_1.HotelInfo, room_entity_1.Room, conversation_entity_1.Conversation, message_entity_1.Message, sales_script_entity_1.SalesScript]),
            ],
            controllers: [
                hotel_controller_1.HotelController,
                conversation_controller_1.ConversationController,
                room_controller_1.RoomController,
                sales_script_controller_1.SalesScriptController,
            ],
            providers: [
                hotel_service_1.HotelService,
                conversation_service_1.ConversationService,
                gemini_service_1.GeminiService,
                ai_service_1.AIConfigService,
                room_service_1.RoomService,
                sales_script_service_1.SalesScriptService,
                seed_service_1.SeedService,
            ],
            exports: [hotel_service_1.HotelService, conversation_service_1.ConversationService, gemini_service_1.GeminiService],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var HotelModule = _classThis = class {
    };
    __setFunctionName(_classThis, "HotelModule");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HotelModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HotelModule = _classThis;
})();
exports.HotelModule = HotelModule;
