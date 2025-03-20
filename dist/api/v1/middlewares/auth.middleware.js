"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request headers:", req.headers);
    console.log("Authorization:", req.headers.authorization);
    try {
        if (!req.headers.authorization) {
            res.status(401).json({
                code: 401,
                message: "Vui lòng gửi kèm token"
            });
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token:", token);
        if (!token) {
            res.status(401).json({
                code: 401,
                message: "Token không được để trống"
            });
            return;
        }
        const user = yield user_model_1.default.findOne({
            deleted: false,
            token: token
        }).select("-password");
        if (!user) {
            res.status(401).json({
                code: 401,
                message: "Token không hợp lệ"
            });
            return;
        }
        req["user"] = user;
        next();
    }
    catch (error) {
        console.error("Error in requireAuth middleware:", error);
        res.status(500).json({
            code: 500,
            message: "Lỗi server"
        });
    }
});
exports.requireAuth = requireAuth;
