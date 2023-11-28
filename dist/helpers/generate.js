"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRamdomNumer = exports.generateRamdomString = void 0;
const generateRamdomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateRamdomString = generateRamdomString;
const generateRamdomNumer = (length) => {
    const characters = "0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
exports.generateRamdomNumer = generateRamdomNumer;
