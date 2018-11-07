var socket = io();

socket.on('connect',function(){
  console.log('Connected to server');
  
  socket.emit('createMessage',{
      from:'ashlesh',
      text:'fjds bsbgf vnkvnkfnkv'
  });
});


socket.on('disconnect',function(){
  console.log('DisConnected to server');
  
});

socket.on('newMessage',function(message){
    console.log('new email :',message);
    
  });
  