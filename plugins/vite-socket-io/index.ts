import { Plugin } from 'vite';
import { Server } from 'socket.io';

export default function socketIOServer(): Plugin {
    let io: Server;

    function closeServer() {
        console.log("Stopping Socket.IO server...");
        io.sockets.sockets.forEach((socket) => {
            socket.disconnect(true);
            socket.removeAllListeners();
        });
        io.httpServer.close();
    }

    function openServer() {
        console.log("Starting Socket.IO server...");
        io = new Server(3000, {
            cors: {
                origin: "*",
            }
        });
        io.on("connection", (socket) => {
            console.log("a user connected");
            socket.on("disconnect", () => {
                console.log("user disconnected");
            });
            socket.on("kvstore:update", (message) => {
                io.emit("kvstore:update", message);
            });
            socket.on("btnClick", (message) => {
                io.emit("btnClick", message);
            });

        });
    }

    return {
        name: 'vite-socket-io',
        buildStart() {
            openServer();
        },
        buildEnd() {
            closeServer();
        }
    };
}
