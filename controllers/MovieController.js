const jwt = require("jsonwebtoken");
const Movie = require("../models/Movie");
const { default: mongoose } = require("mongoose");
const Admin = require("../models/Admin");

const addMovie = async (req, res) => {
	const extractToken = req.headers.authorization;
	console.log(req.headers.authorization); // Log the token to inspect its format

	if (!extractToken || !extractToken.startsWith("Bearer ")) {
		return res
			.status(404)
			.json({ message: "Invalid token format or Token Not Found" });
	}

	const token = extractToken.split(" ")[1]; // Extract the token from "Bearer <token>"

	try {
		const decrypted = jwt.verify(token, "sameer");

		const adminId = decrypted.id;
		const { title, description, releaseDate, posterUrl, featured, actors } =
			req.body;

		// const formattedDate = new Date(`${releaseDate}`).toISOString().split('T')[0];

		const formattedDate = releaseDate; // Assuming releaseDate is already in "YYYY-MM-DD" format

		if (!title || !description || !posterUrl) {
			return res.status(422).json({ message: "Invalid Inputs" });
		}

		const movie = new Movie({
			description,
			releaseDate: formattedDate,
			posterUrl,
			actors,
			featured,
			admin: adminId,
			posterUrl,
			title,
		});

		const session = await mongoose.startSession();
		const adminUser = await Admin.findById(adminId);
		session.startTransaction();



try {
			await movie.save({ session });
			adminUser.addedMovies.push(movie);
			await adminUser.save({ session });
			await session.commitTransaction();
	await movie.save();
	const allmove = Movie.findOne({})
	console.log(allmove);
			return res.status(201).json({ movie });
		} catch (error) {
			await session.abortTransaction();
			throw error; // Re-throw the error for further handling
		} finally {
			session.endSession();
		}
	} catch (err) {
		console.error(err);
		return res.status(400).json({ message: "Invalid token or error: " + err.message });
	}
};





const getMovie = async (req, res) => {
	try {
		const allMovies = await Movie.find(); // Use find() to get all movies
		console.log(allMovies); // Log the retrieved movies
		if (!allMovies || allMovies.length === 0) {
			return res.status(404).json({ message: "No movies found" });
		}
		return res.status(200).json(allMovies );
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Internal server error" });
	}
};


const getMovieById = async (req, res) => {
	const movieId = req.params.id;
	let getMovieById;
	try {
		getMovieById = await Movie.findById(movieId);
		if (!getMovieById) {
			return res.status(404).json({ message: "Movie Not found" });
		}
		return res.status(200).json( getMovieById );
	} catch (err) {
		console.log(err);
	}
};
module.exports = { addMovie, getMovie, getMovieById };
