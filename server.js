const path = require('path')
const express = require('express');
const http = require('http');
const socketio = require('socket.io');


const app = express()
const server = http.createServer(app)
const io = socketio(server)


// HTML
app.use(express.static(path.join(__dirname, 'public')))

// socket
io.on('connection', socket => {
    
    // welcome current user
    socket.emit('message', 'Welcome to my chat app');

    // when user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    // when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
})


const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log('Server started on', PORT))