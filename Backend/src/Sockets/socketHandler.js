export default function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log(`New socket connected: ${socket.id}`);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
}
