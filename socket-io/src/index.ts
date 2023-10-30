import express from 'express';
import http from 'http';
import { Namespace, Server } from 'socket.io';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import { createAdapter } from "@socket.io/redis-adapter";
import { Emitter } from "@socket.io/redis-emitter";
import { generateRoomCode } from './utils/generateRoomCode';

import registerFooNameSpace from './namespaces/foo';
import registerSpeedgameNameSpace from './namespaces/speedgame';

import type { Profile } from 'passport-github';

const app = express();

const server = http.createServer(app);

interface StarShape {
    id: string;
    x: number;
    y: number;
    rotation: number;
    isDragging: boolean;
}

declare module 'express-session' {
    interface SessionData {
        passport: {
            user: Profile;
        }
    }
}

declare module 'http' {
    interface IncomingMessage {
        session: {
            passport: {
                user: Profile;
            }
        }
    }
}

interface ServerToClientEvents {
    helloReply: () => void;
    roomCreatedReply: (data: { roomCode: string }) => void;
    joinRoomReply: (data: { success: boolean }) => void;
    message: (data: { message: string }) => void;
    setStarShapes: (data: { starShapes: StarShape[] }) => void;
}

interface ClientToServerEvents {
    hello: () => void;
    createNewRoom: () => void;
    joinRoom: (data: { roomCode: string }) => void;
    sendMessage: (data: { message: string, room: string }) => void;
    setStarShapes: (data: { roomCode: string, starShapes: StarShape[] }) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}



function generateStarShapes(maxStars: number, maxWidth: number, maxHeight: number): StarShape[] {
    let starShapes: StarShape[] = [];
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

function noStarsAreDragging(starShapes: StarShape[]): boolean {
    return starShapes.every(starShape => !starShape.isDragging);
}

let redisClient = createClient({
    url: 'redis://redis:6379',
});

const pubClient = redisClient.duplicate();
const subClient = redisClient.duplicate();
const emitterClient = redisClient.duplicate();

subClient.on("message", (channel, message) => {
    console.log(`Received ${message} from ${channel}`);
});

let redisStore = new RedisStore({
    client: redisClient,
    prefix: 'session:',
})

const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(server);

let emitter: Emitter<ServerToClientEvents>;

Promise.all([redisClient.connect(), pubClient.connect(), subClient.connect(), emitterClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    io.engine.use(session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: redisStore,
    }));

    emitter = new Emitter(emitterClient);
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
        const roomCode: string = generateRoomCode();
        const starShapes = generateStarShapes(5, 340, 512);

        redisClient.set(roomCode, JSON.stringify(starShapes));

        socket.join(roomCode);
        // socket.emit('roomCreatedReply', { roomCode });        
        emitter.to(socket.id).emit('roomCreatedReply', { roomCode });
    });

    socket.on('joinRoom', async (data) => {
        console.log('Received joinRoom event', data);
        // Handle the joinRoom event here
        if (!io.sockets.adapter.rooms.get(data.roomCode)) {
            socket.emit('joinRoomReply', { success: false });
            return;
        }

        socket.join(data.roomCode);
        socket.emit('joinRoomReply', { success: true });

        const starShapes = await redisClient.get(data.roomCode);
        if (starShapes) {
            emitter.to(data.roomCode).emit('setStarShapes', { starShapes: JSON.parse(starShapes) });
        }
    });

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

interface NamedSocketClientToServerEvents {
    test: () => void;
}

interface NamedSocketServerToClientEvents {
    test: (data: { message: string }) => void;
}

// const roomNamespace = io.of("/foo") as Namespace<NamedSocketClientToServerEvents, NamedSocketServerToClientEvents>;
// roomNamespace.on("connection", (socket) => {
//     socket.emit("test", { message: "test" });
//     console.log('a user connected to /room');
// });

// roomNamespace.on("test", (socket) => {
//     console.log("test emmited to /room");
// });

registerFooNameSpace(io);
registerSpeedgameNameSpace(io);

server.listen(3000, () => {
    console.log('listening on *:3000');
});