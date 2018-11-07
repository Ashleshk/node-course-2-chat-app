const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
 
const {generateMessage, generateLocationMessage} = require('./utils/message');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));


io.on('connection', (socket) => {
  console.log('New user connected');
  
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
     

  socket.on('createMessage',(message)=>{
    console.log('createEmail :',message);
    io.emit('newMessage',generateMessage(message.from,message.text));
    //   from:message.from,
    //   text:message.text,
    //   createAt:new Date().getTime()
    // });
    
  });
  socket.on('disconnect',()=>{
    console.log('user was disconnected');
    
  });
});
   
 

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
