"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoomCode = void 0;
// this function will generate a random four character alphanumeric string
function generateRoomCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.generateRoomCode = generateRoomCode;
