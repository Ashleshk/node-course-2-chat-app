const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocation, generateGif} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
const {Rooms} = require('./utils/rooms');
const {getGif} = require('./utils/giphy');


const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
let rooms = new Rooms();


app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.emit('loadRooms', rooms.getRooms());

  socket.on('join', (params, callback) => {
    let roomSelect = params.room_select.toLowerCase();
		let roomInput = params.room_input.toLowerCase();
		let room = roomSelect || roomInput;
		if (!isRealString(params.name) || !isRealString(room)) {
			return callback('Name and room name are required');
    } 
    
		if(isRealString(roomSelect) && isRealString(roomInput)) {
			return callback('Either select a room or create one');
    }
    
    let roomCheck = () => {
			//add room if it isn't already in the array
			if(!rooms.getRooms().includes(room)) {
				rooms.addRoom(room);
			}
			console.log('Rooms:', rooms.getRooms());
    }
    
    let joinRoom = () => {
			//socket.join takes a string
			socket.join(room);
			//remove user from any previous rooms before adding to new one
			users.removeUser(socket.id);
			users.addUser(socket.id, params.name, room);

			roomCheck();

			//only emits to specific room
			io.to(room).emit('updateUserList', users.getUserList(room));
			socket.emit('newMessage', generateMessage('Admin', `WELCOME TO THE ${room.toUpperCase()} ROOM`));
			socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `User ${params.name} has joined.`));
		};

		//check to see if user name already exists in room
		if(users.getUserList(room).includes(params.name)) {
			//prevent duplicate rooms getting added to select at index.html
			roomCheck();
			return callback('Name already exists, please choose another');
		} else {
			joinRoom();
		}

		callback();
	});

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }

    callback();
  });

  socket.on('createGifMessage', (message, callback) => {
		let user = users.getUser(socket.id);

		if(user && isRealString(message.query)) {
			getGif(message.query)
			.then((response) => {
				let url = response;
				io.to(user.room).emit('newGifMessage', generateGif(user.name, url));
			})
			.catch((err) => {
				console.log(err);
			})
		}
		callback();
	});
  // socket.on('createLocationMessage', (coords) => {
  //   var user = users.getUser(socket.id);

  //   if (user) {
  //     io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));  
  //   }
  // });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    let roomKeys = Object.keys(socket.adapter.rooms);

    rooms.getRooms().map((room) => {
			if(!roomKeys.includes(room)) {
				rooms.removeRoom(room);
				console.log('After remove: ', rooms.getRooms());
			}
    });
    
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
