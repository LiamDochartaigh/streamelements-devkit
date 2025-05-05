import { Plugin } from 'vite';
import { Server } from 'socket.io';

export default function socketIOServer(): Plugin {
    let io: Server;
    return {
        name: 'vite-socket-io',
        buildStart() {
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
            });
        },
        buildEnd() {
            console.log("Stopping Socket.IO server...");
            io.sockets.sockets.forEach((socket) => {
                socket.disconnect(true);
            });
            io.httpServer.close();
        }
    };
}