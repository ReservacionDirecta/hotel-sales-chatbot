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
exports.HotelController = void 0;
const common_1 = require("@nestjs/common");
let HotelController = (() => {
    let _classDecorators = [(0, common_1.Controller)('hotel')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getHotel_decorators;
    let _getRooms_decorators;
    let _getAvailableRooms_decorators;
    let _getConversations_decorators;
    let _createRoom_decorators;
    let _updateRoom_decorators;
    let _getConversation_decorators;
    let _getSalesScripts_decorators;
    let _createSalesScript_decorators;
    let _updateSalesScript_decorators;
    var HotelController = _classThis = class {
        constructor(hotelService) {
            this.hotelService = (__runInitializers(this, _instanceExtraInitializers), hotelService);
        }
        getHotel() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.getHotel();
            });
        }
        getRooms() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.getRooms();
            });
        }
        getAvailableRooms(date) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.getAvailableRooms(date);
            });
        }
        getConversations() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.getConversations();
            });
        }
        createRoom(roomData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.createRoom(roomData);
            });
        }
        updateRoom(id, roomData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.updateRoom(parseInt(id), roomData);
            });
        }
        getConversation(id) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.getConversation(parseInt(id));
            });
        }
        getSalesScripts() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.getSalesScripts();
            });
        }
        createSalesScript(scriptData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.createSalesScript(scriptData);
            });
        }
        updateSalesScript(id, scriptData) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.hotelService.updateSalesScript(parseInt(id), scriptData);
            });
        }
    };
    __setFunctionName(_classThis, "HotelController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getHotel_decorators = [(0, common_1.Get)()];
        _getRooms_decorators = [(0, common_1.Get)('rooms')];
        _getAvailableRooms_decorators = [(0, common_1.Get)('rooms/available')];
        _getConversations_decorators = [(0, common_1.Get)('conversations')];
        _createRoom_decorators = [(0, common_1.Post)('rooms')];
        _updateRoom_decorators = [(0, common_1.Patch)('rooms/:id')];
        _getConversation_decorators = [(0, common_1.Get)('conversations/:id')];
        _getSalesScripts_decorators = [(0, common_1.Get)('scripts')];
        _createSalesScript_decorators = [(0, common_1.Post)('scripts')];
        _updateSalesScript_decorators = [(0, common_1.Patch)('scripts/:id')];
        __esDecorate(_classThis, null, _getHotel_decorators, { kind: "method", name: "getHotel", static: false, private: false, access: { has: obj => "getHotel" in obj, get: obj => obj.getHotel }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRooms_decorators, { kind: "method", name: "getRooms", static: false, private: false, access: { has: obj => "getRooms" in obj, get: obj => obj.getRooms }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAvailableRooms_decorators, { kind: "method", name: "getAvailableRooms", static: false, private: false, access: { has: obj => "getAvailableRooms" in obj, get: obj => obj.getAvailableRooms }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConversations_decorators, { kind: "method", name: "getConversations", static: false, private: false, access: { has: obj => "getConversations" in obj, get: obj => obj.getConversations }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createRoom_decorators, { kind: "method", name: "createRoom", static: false, private: false, access: { has: obj => "createRoom" in obj, get: obj => obj.createRoom }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateRoom_decorators, { kind: "method", name: "updateRoom", static: false, private: false, access: { has: obj => "updateRoom" in obj, get: obj => obj.updateRoom }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConversation_decorators, { kind: "method", name: "getConversation", static: false, private: false, access: { has: obj => "getConversation" in obj, get: obj => obj.getConversation }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSalesScripts_decorators, { kind: "method", name: "getSalesScripts", static: false, private: false, access: { has: obj => "getSalesScripts" in obj, get: obj => obj.getSalesScripts }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSalesScript_decorators, { kind: "method", name: "createSalesScript", static: false, private: false, access: { has: obj => "createSalesScript" in obj, get: obj => obj.createSalesScript }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSalesScript_decorators, { kind: "method", name: "updateSalesScript", static: false, private: false, access: { has: obj => "updateSalesScript" in obj, get: obj => obj.updateSalesScript }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HotelController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HotelController = _classThis;
})();
exports.HotelController = HotelController;
