const path = require('path')
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');


const app = express()
const server = http.createServer(app)
const io = socketio(server)


// HTML
app.use(express.static(path.join(__dirname, 'public')))

let user = 'Rohan'

// socket
io.on('connection', socket => {
    
    // welcome current user
    socket.emit('message', formatMessage(user, 'Welcome to my chat app'));

    // when user connects
    socket.broadcast.emit('message', formatMessage(user, 'A user has joined the chat'));

    // when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(user, 'A user has left the chat'));
    })

    // listen to chat message
    socket.on('chatMessage', msg => {
        io.emit('message', formatMessage('USER', msg));
    })
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log('Server started on', PORT))