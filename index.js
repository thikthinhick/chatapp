const express = require('express');
const app = express();
app.set('view engine', "ejs");
app.set('views', './views');
app.use(express.static('public'));
var server = require('http').Server(app);
var io = require("socket.io")(server);
app.get('/', function(req, res) {
    res.render('trangchu')
})
var array = ['lechuong']
io.on("connection", function(socket) {
    console.log("ket noi vs id " + socket.id);
    
    socket.on("disconnect", function() { 
        array.splice(array.indexOf(socket.username))
        io.sockets.emit('list-user-online', array)
      
    })
    socket.on("client-send-username", function(data) {
        if(data.indexOf(array) >= 0) {

            socket.emit('error-login');
            
        }
        else{
            array.push(data);
            socket.username = data;
            io.sockets.emit('list-user-online', array)
            socket.emit('success-login');
            
        }
    })
    socket.on('send-comment', (data) => {
        socket.broadcast.emit('reply-comment', data);
    })
})
server.listen(3000);
