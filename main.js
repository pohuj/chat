const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoClient = require('mongodb').MongoClient;
let db;

const config = require('./config.json');

app.use(express.json());
//app.use(express.urlencoded({extended : true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

app.post('/user', function (req, res) {
    console.log(req.body);
    //res.sendFile(__dirname + '/view/index.html');
    let user = {
      name : req.body.name
    };
    db.collection('user').insertOne(user, (err, reply) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        console.log(reply);
        res.send(user);
    });
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



mongoClient.connect('mongodb://localhost:27017/first', function (err, client) {
   if(err){
       return console.log(err);
   }

   db = client.db('first');

   http.listen(config.port, function () {
       console.log(`listening on *:${config.port}`);
   });
   console.log('MongoDB started');
});
