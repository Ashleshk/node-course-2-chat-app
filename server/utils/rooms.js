class Rooms {
	constructor() {
		this.rooms = [];
	}

	addRoom(name) {
		this.rooms.push(name);
	}

	removeRoom(name) {
		this.rooms = this.rooms.filter((room) => room != name);
	}

	getRooms() {
		return this.rooms;
	}
}

module.exports = {Rooms};
