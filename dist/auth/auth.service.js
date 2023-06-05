"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_entity_1 = require("./entities/user.entity");
const mongoose_2 = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async create(createUserDto) {
        try {
            const { password } = createUserDto, userData = __rest(createUserDto, ["password"]);
            const newUser = new this.userModel(Object.assign({ password: bcryptjs.hashSync(password, 10) }, userData));
            await newUser.save();
            const _a = newUser.toJSON(), { password: _ } = _a, user = __rest(_a, ["password"]);
            return user;
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException(`${createUserDto.email} already exist!`);
            }
            console.error(error);
            throw new common_1.InternalServerErrorException('Something terrible happen!!');
        }
    }
    async register(RegisterUserDto) {
        const user = await this.create(RegisterUserDto);
        return {
            user,
            token: this.getJWT({ id: user._id })
        };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user || !bcryptjs.compareSync(password, user.password)) {
            throw new common_1.UnauthorizedException('No valid credentials!');
        }
        const _a = user.toJSON(), { password: _ } = _a, rest = __rest(_a, ["password"]);
        return {
            user: rest,
            token: this.getJWT({ id: user.id })
        };
    }
    findAll() {
        return this.userModel.find();
    }
    async findUserById(id) {
        const user = await this.userModel.findById(id);
        const _a = user.toJSON(), { password } = _a, rest = __rest(_a, ["password"]);
        return rest;
    }
    findOne(id) {
        return `This action returns a #${id} auth`;
    }
    update(id, updateAuthDto) {
        return `This action updates a #${id} auth`;
    }
    remove(id) {
        return `This action removes a #${id} auth`;
    }
    getJWT(payload) {
        const token = this.jwtService.sign(payload);
        return token;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_entity_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map