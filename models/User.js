const mongoose = require("mongoose");
const userScheme = new mongoose.Schema({
	bookings: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
});

module.exports = mongoose.model("CUser", userScheme);

