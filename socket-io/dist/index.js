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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
const redis_adapter_1 = require("@socket.io/redis-adapter");
const redis_emitter_1 = require("@socket.io/redis-emitter");
const generateRoomCode_1 = require("./utils/generateRoomCode");
const foo_1 = __importDefault(require("./namespaces/foo"));
const speedgame_1 = __importDefault(require("./namespaces/speedgame"));
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
function noStarsAreDragging(starShapes) {
    return starShapes.every(starShape => !starShape.isDragging);
}
let redisClient = (0, redis_1.createClient)({
    url: 'redis://redis:6379',
});
const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();
const emitterClient = redisClient.duplicate();
subClient.on("message", (channel, message) => {
    console.log(`Received ${message} from ${channel}`);
});
let redisStore = new connect_redis_1.default({
    client: redisClient,
    prefix: 'session:',
});
const io = new socket_io_1.Server(server);
let emitter;
Promise.all([redisClient.connect(), pubClient.connect(), subClient.connect(), emitterClient.connect()]).then(() => {
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    io.engine.use((0, express_session_1.default)({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: redisStore,
    }));
    emitter = new redis_emitter_1.Emitter(emitterClient);
});
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
        const roomCode = (0, generateRoomCode_1.generateRoomCode)();
        const starShapes = generateStarShapes(5, 340, 512);
        redisClient.set(roomCode, JSON.stringify(starShapes));
        socket.join(roomCode);
        // socket.emit('roomCreatedReply', { roomCode });        
        emitter.to(socket.id).emit('roomCreatedReply', { roomCode });
    });
    socket.on('joinRoom', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Received joinRoom event', data);
        // Handle the joinRoom event here
        if (!io.sockets.adapter.rooms.get(data.roomCode)) {
            socket.emit('joinRoomReply', { success: false });
            return;
        }
        socket.join(data.roomCode);
        socket.emit('joinRoomReply', { success: true });
        const starShapes = yield redisClient.get(data.roomCode);
        if (starShapes) {
            emitter.to(data.roomCode).emit('setStarShapes', { starShapes: JSON.parse(starShapes) });
        }
    }));
    socket.on('sendMessage', (data) => {
        console.log('Received sendMessage event', data);
        // Handle the sendMessage event here
        io.to(data.room).emit('message', { message: data.message });
    });
    socket.on('setStarShapes', (data) => {
        console.log('Received setStarShapes event', data);
        // Handle the setStarShapes event here        
        emitter.to(data.roomCode).emit('setStarShapes', { starShapes: data.starShapes });
        if (noStarsAreDragging(data.starShapes)) {
            redisClient.set(data.roomCode, JSON.stringify(data.starShapes));
        }
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
// const roomNamespace = io.of("/foo") as Namespace<NamedSocketClientToServerEvents, NamedSocketServerToClientEvents>;
// roomNamespace.on("connection", (socket) => {
//     socket.emit("test", { message: "test" });
//     console.log('a user connected to /room');
// });
// roomNamespace.on("test", (socket) => {
//     console.log("test emmited to /room");
// });
(0, foo_1.default)(io);
(0, speedgame_1.default)(io);
server.listen(3000, () => {
    console.log('listening on *:3000');
});
