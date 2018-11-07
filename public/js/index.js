let socket = io();

socket.on('connect', () => {
	console.log('Index connected');

	socket.on('loadRooms', function(rooms) {
		
		rooms.forEach(function(room) {
			$('#room-select').append($('<option></option>').text(room.toUpperCase()).attr('value', `${room}`));
		});
	});
});


			
