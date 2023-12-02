const { default: mongoose } = require("mongoose");

const adminScheme = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		minLength: 6,
		required: true,
	},
	addedMovies: [
		{
			type: mongoose.Types.ObjectId,
			ref:"Movie"
		},
	],
});
module.exports= mongoose.model("Admin",adminScheme);