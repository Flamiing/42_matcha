// Third-Party Imports:
import { Server } from 'socket.io';

export default class SocketHandler {
    constructor(server) {
        this.io = new Server(server, {
            cors: {
                origin: '*'
            },
        });
        
        this.#setupSocketHandler();
    }

    #setupSocketHandler() {
        this.io.on('connection', (socket) => {
            console.log(`New socket connected: ${socket.id}`);
    
            socket.on('disconnect', () => {
                console.log(`Socket disconnected: ${socket.id}`)
            })
        })
    }
}
