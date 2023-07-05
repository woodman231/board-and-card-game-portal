"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
function generateStarShapes(maxStars, maxWidth, maxHeight) {
    let starShapes = [];
    for (let i = 0; i < maxStars; i++) {
        starShapes.push({
            id: i.toString(),
            x: Math.random() * maxWidth,
            y: Math.random() * maxHeight,
            rotation: Math.random() * 180,
            isDragging: false
        });
    }
    return starShapes;
}
let starShapeInstances = {};
const io = new socket_io_1.Server(server);
let redisClient = (0, redis_1.createClient)({
    url: 'redis://redis:6379',
});
redisClient.connect().catch(console.error);
let redisStore = new connect_redis_1.default({
    client: redisClient,
    prefix: 'session:',
});
io.engine.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: redisStore,
}));
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('hello', () => {
        console.log('Received hello event');
        const { data } = socket;
        console.log('data', data);
        console.log('passport user', socket.request.session.passport.user);
        // Handle the hello event here
        socket.emit('helloReply');
    });
    socket.on('createNewRoom', () => {
        console.log('Received createNewRoom event');
        // Handle the createNewRoom event here
        const roomCode = "1234";
        starShapeInstances[roomCode] = generateStarShapes(5, 340, 512);
        socket.join(roomCode);
        socket.emit('roomCreatedReply', { roomCode: '1234' });
    });
    socket.on('joinRoom', (data) => {
        console.log('Received joinRoom event', data);
        // Handle the joinRoom event here
        socket.join(data.roomCode);
        socket.emit('joinRoomReply', { success: true });
        io.to(data.roomCode).emit('setStarShapes', { starShapes: starShapeInstances[data.roomCode] });
    });
    socket.on('sendMessage', (data) => {
        console.log('Received sendMessage event', data);
        // Handle the sendMessage event here
        io.to(data.room).emit('message', { message: data.message });
    });
    socket.on('setStarShapes', (data) => {
        console.log('Received setStarShapes event', data);
        // Handle the setStarShapes event here
        starShapeInstances[data.roomCode] = data.starShapes;
        io.to(data.roomCode).emit('setStarShapes', { starShapes: data.starShapes });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
io.of("/").adapter.on("create-room", (room) => {
    console.log(`room ${room} was created`);
});
io.of("/").adapter.on("join-room", (room, id) => {
    console.log(`socket ${id} has joined room ${room}`);
});
server.listen(3000, () => {
    console.log('listening on *:3000');
});
