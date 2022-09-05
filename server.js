const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})
app.get('/:room', (req, res) => {
     res.render('room',{roomId: req.params.room})
     res.render('script', {roomId: req.params.room})
})
io.on('connection', socket => {
    socket.on('join-room', (roomId,userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message)
        })
    })
})

server.listen(process.env.PORT || 3030);










// const express = require('express');
// const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server)
// const {v4: uuidv4 } = require('uuid');
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//     debug: true
// });

// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// app.use('/peerjs', peerServer);
// app.get('/',(req,res) => {
//     res.redirect(`/${uuidv4()}`);
// })

// app.get('/:room', (req, res) => {
//     res.render('room', { roomId: req.params.room})
// })

// io.on('connection',socket => {
//     socket.on('join-room', (roomId,userId) => {
//         // console.log("joined room");
//         socket.join(roomId);
//         // socket.to(roomId).broadcast.emit('user-connected');
//         socket.broadcast.to(roomId).emit('user-connected', userId);
//     })
// })
// server.listen(3040);  