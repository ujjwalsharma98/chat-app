const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


// using Qs library to get params from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io()

socket.emit('joinRoom', { username, room })

// Users & Room info
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUser(users);
})

socket.on('message', message => {
    console.log("******", message)
    outputMessage(message)
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msg = e.target.elements.msg.value;

    // Send chat message
    socket.emit('chatMessage', msg)

    // clear input field & then focus
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> ${message.userName} <span> ${message.time} </span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}

// Add Room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add Users to DOM
function outputUser(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}