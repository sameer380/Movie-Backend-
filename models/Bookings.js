const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	movie: {
		type: mongoose.Types.ObjectId,
		ref: "Movie",
		required: true,
	},
	date: {
		type: Date,
		default: Date.now, // Or any default date logic you prefer
	},
	seatNumber: {
		type: Number,
		required: true,
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: "CUser",
		required: true,
	},
});

module.exports = mongoose.model("Bookings", bookingSchema);
