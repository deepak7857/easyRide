 const socketIo = require('socket.io');
 const userModel = require('./model/user.model');
 const captainModel =require ('./model/captain.model');
let io;
function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);


        socket.on('join', async (data) => {
            const { userId, userType } = data;

            if (!userId || !userType) {
                return;
            }

            // Join a stable room so reconnects do not break event delivery.
            socket.join(String(userId));

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location || location.lat == null || location.lng == null) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            const updatedCaptain = await captainModel.findByIdAndUpdate(userId, {
                'vehicle.location': {
                    type: 'Point',
                    coordinates: [location.lng, location.lat]
                }
            }, { new: true });
            console.log(`✅ Captain location updated: ${userId} at [${location.lng}, ${location.lat}]`);
        });

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (targetId, messageObject) => {
    console.log(`📤 Attempting to emit event "${messageObject.event}" to target: ${targetId}`);
    console.log(`📦 Message data:`, messageObject.data);

    if (io) {
        io.to(String(targetId)).emit(messageObject.event, messageObject.data);
        console.log(`✅ Message emitted successfully to ${targetId}`);
    } else {
        console.log('❌ Socket.io not initialized - cannot send message');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };