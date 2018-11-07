var socket = io();

socket.on('connect',function(){
  console.log('Connected to server');   
});


socket.on('disconnect',function(){
  console.log('DisConnected to server');
});

socket.on('newMessage',function(message){
    console.log('new email :',message);
    var li=jQuery('<li></li>');
    li.text(`${message.from}:${message.text}`);

    jQuery('#messages').append(li);
  });

socket.emit('createMessage',{
    from:'frank',
    text:'hi'
},function(data){
  console.log('Got it',data);
  
});

jQuery('#message-form').on('submit', function (e) {
e.preventDefault();

var messageTextbox = jQuery('[name=message]');

socket.emit('createMessage', {
    text: messageTextbox.val()
}, function () {
   // messageTextbox.val('')
});
});