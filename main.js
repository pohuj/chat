const app = require('express')();
const http = require('http').Server(app);
const config = require('./config.json');
const io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

});

http.listen(config.port, function () {
    console.log(`listening on *:${config.port}`);
});


