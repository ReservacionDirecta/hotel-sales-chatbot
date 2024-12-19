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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSettingsDto = void 0;
const class_validator_1 = require("class-validator");
let UpdateSettingsDto = (() => {
    var _a;
    let _currency_decorators;
    let _currency_initializers = [];
    let _currency_extraInitializers = [];
    let _language_decorators;
    let _language_initializers = [];
    let _language_extraInitializers = [];
    let _timeZone_decorators;
    let _timeZone_initializers = [];
    let _timeZone_extraInitializers = [];
    let _welcomeMessage_decorators;
    let _welcomeMessage_initializers = [];
    let _welcomeMessage_extraInitializers = [];
    let _businessName_decorators;
    let _businessName_initializers = [];
    let _businessName_extraInitializers = [];
    let _businessHours_decorators;
    let _businessHours_initializers = [];
    let _businessHours_extraInitializers = [];
    let _notificationEmail_decorators;
    let _notificationEmail_initializers = [];
    let _notificationEmail_extraInitializers = [];
    return _a = class UpdateSettingsDto {
            constructor() {
                this.currency = __runInitializers(this, _currency_initializers, void 0);
                this.language = (__runInitializers(this, _currency_extraInitializers), __runInitializers(this, _language_initializers, void 0));
                this.timeZone = (__runInitializers(this, _language_extraInitializers), __runInitializers(this, _timeZone_initializers, void 0));
                this.welcomeMessage = (__runInitializers(this, _timeZone_extraInitializers), __runInitializers(this, _welcomeMessage_initializers, void 0));
                this.businessName = (__runInitializers(this, _welcomeMessage_extraInitializers), __runInitializers(this, _businessName_initializers, void 0));
                this.businessHours = (__runInitializers(this, _businessName_extraInitializers), __runInitializers(this, _businessHours_initializers, void 0));
                this.notificationEmail = (__runInitializers(this, _businessHours_extraInitializers), __runInitializers(this, _notificationEmail_initializers, void 0));
                __runInitializers(this, _notificationEmail_extraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _currency_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _language_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _timeZone_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _welcomeMessage_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _businessName_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _businessHours_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)(), (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
                    message: 'Business hours must be in format HH:mm-HH:mm',
                })];
            _notificationEmail_decorators = [(0, class_validator_1.IsEmail)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _currency_decorators, { kind: "field", name: "currency", static: false, private: false, access: { has: obj => "currency" in obj, get: obj => obj.currency, set: (obj, value) => { obj.currency = value; } }, metadata: _metadata }, _currency_initializers, _currency_extraInitializers);
            __esDecorate(null, null, _language_decorators, { kind: "field", name: "language", static: false, private: false, access: { has: obj => "language" in obj, get: obj => obj.language, set: (obj, value) => { obj.language = value; } }, metadata: _metadata }, _language_initializers, _language_extraInitializers);
            __esDecorate(null, null, _timeZone_decorators, { kind: "field", name: "timeZone", static: false, private: false, access: { has: obj => "timeZone" in obj, get: obj => obj.timeZone, set: (obj, value) => { obj.timeZone = value; } }, metadata: _metadata }, _timeZone_initializers, _timeZone_extraInitializers);
            __esDecorate(null, null, _welcomeMessage_decorators, { kind: "field", name: "welcomeMessage", static: false, private: false, access: { has: obj => "welcomeMessage" in obj, get: obj => obj.welcomeMessage, set: (obj, value) => { obj.welcomeMessage = value; } }, metadata: _metadata }, _welcomeMessage_initializers, _welcomeMessage_extraInitializers);
            __esDecorate(null, null, _businessName_decorators, { kind: "field", name: "businessName", static: false, private: false, access: { has: obj => "businessName" in obj, get: obj => obj.businessName, set: (obj, value) => { obj.businessName = value; } }, metadata: _metadata }, _businessName_initializers, _businessName_extraInitializers);
            __esDecorate(null, null, _businessHours_decorators, { kind: "field", name: "businessHours", static: false, private: false, access: { has: obj => "businessHours" in obj, get: obj => obj.businessHours, set: (obj, value) => { obj.businessHours = value; } }, metadata: _metadata }, _businessHours_initializers, _businessHours_extraInitializers);
            __esDecorate(null, null, _notificationEmail_decorators, { kind: "field", name: "notificationEmail", static: false, private: false, access: { has: obj => "notificationEmail" in obj, get: obj => obj.notificationEmail, set: (obj, value) => { obj.notificationEmail = value; } }, metadata: _metadata }, _notificationEmail_initializers, _notificationEmail_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.UpdateSettingsDto = UpdateSettingsDto;
