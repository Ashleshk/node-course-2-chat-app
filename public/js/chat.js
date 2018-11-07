let socket = io();

function scrollToBottom() {
	//Selectors
	let messages = $('#messages');
	let newMessage = messages.children('li:last-child');

	//Heights
	//prop is a crossbrowser way of performing document selection
	let clientHeight = messages.prop('clientHeight');
	let scrollTop = messages.prop('scrollTop');
	let scrollHeight = messages.prop('scrollHeight');
	let newMessageHeight = newMessage.innerHeight();
	let lastMessageHeight = newMessage.prev().innerHeight();

	if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight) {
		//scrollTop is a jQuery method for setting scrollTop value
		messages.scrollTop(scrollHeight);
	}
};

//using pre-es6 function for cross browser compatibility
socket.on('connect', function() {
	//returns an object of the query params
	let params = $.deparam(window.location.search);
	socket.emit('join', params, function(err) {
		if(err) {
			alert(err);
			//redirects back to root page 
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('disconnect', function() {
	console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
	let ul = $('<ul></ul>');

	users.forEach(function(user) {
		ul.append($('<li></li>').text(user));

		$('#users').html(ul);
	});
});

//custom event, receives message object from emitted event in server.js
socket.on('newMessage', function(message) {
	//html method returns the markup inside message-template
	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = $('#message-template').html();
	let html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newGifMessage', function(message) {

	let formattedTime = moment(message.createdAt).format('h:mm a');
	let template = $('#gif-message-template').html();
	let html = Mustache.render(template, {
		url: message.url,
		from: message.from,
		createdAt: formattedTime
	});

	$('#messages').append(html);
	scrollToBottom();
});

$('#message-form').on('submit', function(e) {
	//prevents page from refreshing on submit
	e.preventDefault();

	let messageTextbox = $('[name=message]')
	
	if(!e.originalEvent) {
		socket.emit('createGifMessage', {
			query: messageTextbox.val()
		}, function() {
			messageTextbox.val('');
		});
	} else {
		socket.emit('createMessage', {
			text: messageTextbox.val()
		}, function() {
			messageTextbox.val('');
		});
	}
});

$('#search-giphy').click(function() {
	$('#message-form').submit()
});



// let locationButton = $('#send-location');
// locationButton.on('click', function() {
// 	//make sure browser has access to geolcation api
// 	if(!navigator.geolocation) {
// 		return alert('Geolocation not supported by your browser');
// 	}

// 	locationButton.attr('disabled', 'disabled').text('Sending Location...');

// 	navigator.geolocation.getCurrentPosition(function(position) {
// 		locationButton.removeAttr('disabled').text('Send Location');

// 		socket.emit('createLocationMessage', {
// 			latitude: position.coords.latitude,
// 			longitude: position.coords.longitude
// 		});
// 	}, function() {
// 		alert('Unable to fetch location');
// 		locationButton.removeAttr('disabled').text('Send Location');
// 	});
// });



