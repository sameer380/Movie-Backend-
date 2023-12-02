const Bookings = require("../models/Bookings");
const Movie = require("../models/Movie");
const User = require("../models/User.js");
const mongoose = require("mongoose");

const newBooking = async (req, res, next) => {
	const { movie, date, seatNumber, user } = req.body;

	let existingMovies;
	let existingUser;

	try { 
		existingMovies = await Movie.findById(movie);
		existingUser = await User.findById(user);
	}
	catch (err) {
		return console.log(err);
	}
	if (!existingMovies) { return res.status(404).json({ Message: "Movie Not found With Given ID" }) }
	if (!existingUser) {
		return res.status(404).json({ message: "User not found with given ID!" });
	}
	let booking;

	try {
		const booking = new Bookings({
			movie,
			date,
			seatNumber,
			user,
		});


		const session = await mongoose.startSession();
		session.startTransaction();
		existingUser.bookings.push(booking);
        existingMovies.bookings.push(booking);
		await existingUser.save({ session });
		await existingMovies.save({ session })
		await booking.save({ session })
		session.commitTransaction();

		// await booking.save();
console.log(booking);
		return res.status(201).json( {booking} );
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Unable to create a booking" });
	}
};



const getBookingById = async (req, res, next) => { 
	const id = req.params.id;
	let bookings;

	try { 
		bookings = await Bookings.findById(id);
	}
	catch (err) {
		console.log(err);
	}

	if (!bookings) {
		res.status(500).json({message:"unexpected Error"})
	}
	return res.status(200).json({ bookings });
}

// const deleteBooking = async (req,res) => {
// 	const id = req.params.id;
// 	let booking;
	
// 	try {
// 		booking = await Bookings.findByIdAndRemove().populate("user movie")
// 		const session = await mongoose.startSession();
// 		session.startTransaction
// 		await booking.user.booking.pull(booking);
// 		await booking.movie.booking.pull(booking);
// 		await booking.movie.save({ session });
// 		await booking.user.save({ session });
// 		session.commitTransaction();
// 		session.startTransaction();
// 	 }
// 	catch (err) {
// 		return res.status(500).json({ message: "Unable to Delete",err });
// 	}
// 	return res.status(200).json({ message: "Successfully Deleted" });

// }

const deleteBooking = async (req, res) => {
	const id = req.params.id;

	try {
		const booking = await Bookings.findByIdAndDelete(id).populate("user movie");

		const session = await mongoose.startSession();
		session.startTransaction();

		// Assuming you have a correct schema structure, access bookings array of user and movie like this
		const user = booking.user;
		const movie = booking.movie;

		// Remove the booking from user's bookings array
		user.bookings.pull(booking);
		await user.save({ session });

		// Remove the booking from movie's bookings array
		movie.bookings.pull(booking);
		await movie.save({ session });

		await session.commitTransaction();
		session.endSession();
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "unable to Delete" });
	}

	return res.status(200).json({ message: "Successfully Deleted" });
};


module.exports = {
	newBooking,
	deleteBooking,
	getBookingById,

};
