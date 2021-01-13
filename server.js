const path = require('path')
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');


const app = express()
const server = http.createServer(app)
const io = socketio(server)


// HTML
app.use(express.static(path.join(__dirname, 'public')))

let bot = 'Rohan'

// socket
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room)

        // welcome current user
        socket.emit('message', formatMessage(bot, 'Welcome to my chat app'));

        // when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${ user.username } has joined the chat`));

    });

    // listen to chat message
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    // when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(bot, 'A user has left the chat'));
    });

})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log('Server started on', PORT))