const Bookings = require("../models/Bookings.js");
const User = require("../models/User.js");
const Movie = require("../models/Movie.js");
const bcrypt = require("bcrypt");
const UserScheme = async (req, res, next) => {
	try {
		const users = await User.find();
		if (!users) {
			res.status(500).json({ message: "Cannot find any user" });
		} else {
			res.status(200).json({ users });
		}
	} catch (err) {
        // return next(err);
        console.log(err);
	}
};

const addUser = async (req, res, next) => {
	const { name, password, email} = req.body;
	if (
		!name &&
		name.trim() === "" &&
		!password  &&
		!email &&
		email.trim() === "" &&
		!password &&
		password.trim() === ""
    ) {
		return res.status(422).json({ message: "Invalid Inputs" });
	}

	let user;
	try {
		user = new User({ name, email, password });
		user = await user.save();
	} catch (err) {
        // return next(err);
        console.log(err);
	}

	if (!user) {
		return res.status(500).json({ message: "Unexpected Error Occured" });
	}
	return res.status(201).json({ id:user._id });
};


const updateUser = async (req, res) => {
	const id = req.params.id;
	const { name, password, email } = req.body;

	// Check if any of the fields are missing or empty
	if (!name || !password || !email) {
		return res.status(422).json({ message: "Invalid Inputs" });
	}

	try {
		// Hash the password
		const saltRounds = 10; // You can adjust the number of rounds as needed

		const hashedPassword = bcrypt.hashSync(password, saltRounds);

		// Find the user by ID and update the information
		const user = await User.findByIdAndUpdate(id, {
			name,
			email,
			password: hashedPassword,
		});

		if (!user) {
			return res.status(500).json({ message: "Something went wrong" });
		}

		return res.status(200).json({ message: "Updated Successfully" });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "Something went wrong" });
	}
};

const deleteUser = async(req, res, next)=>{
    const id = req.params.id;
    let user;
    try { 
        user =await User.findByIdAndDelete(id);

    } catch (err) {
        console.log(err);
    }

    if (!user) {
        return res.status(500).json({message:"something went wrong on delete"})
    }
    return res.status(200).json({message:"Remove sucessfull "})
}

const login = async (req, res, next) => {
	const { email, password } = req.body;
	if (!password || !email) {
		return res.status(422).json({ message: "Invalid Inputs" });
	}

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "Can't find the user" });
		}

		const isMatch = bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect Password" });
		}

		return res.status(200).json({ message: "Login Successful", id:user._id });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};


// const getBookingOfUser = async (req,res) => {
// 	const id = req.params.id;
// 	let booking;

// 	try {
// 		booking = await Bookings.find({ user: id });
// 	} catch (err) {
// 		return console.log(err);
// 	}

// 	if (!booking)
// 		return res.status(500).json({ message: "unable to get Booking" });

// 	return res.status(200).json({ booking });
// };


const getBookingOfUser = async (req, res) => {
	const id = req.params.id;
	let booking;

	try {
		booking = await Bookings.find({ user: id })
			.populate("movie")
			.populate("user");
		// Use populate() to replace the `movie` and `user` IDs with their actual objects
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: "Unable to get bookings" });
	}

	if (!booking || booking.length === 0) {
		return res.status(404).json({ message: "No bookings found for the user" });
	}

	return res.status(200).json({ booking });
};
// const getUserById = async (req, res, next) => {
// 	const id = req.params.id;
// 	let users;
// 	try {
// 	users = await User.findById(id);
// 		if (!users) {
// 			res.status(500).json({ message: "Cannot find any user" });
// 		} else {
// 			res.status(200).json({ users });
// 		}
// 	} catch (err) {
// 		// return next(err);
// 		console.log(err);
// 	}
// 	return res.status(200).json({ users });
// };
const getUserById = async (req, res, next) => {
	const id = req.params.id;
	let users;
	try {
		users = await User.findById(id);
		if (!users) {
			return res.status(500).json({ message: "Cannot find any user" });
		} else {
			return res.status(200).json({ users });
		}
	} catch (err) {
		// return next(err);
		console.error(err);
		return res.status(500).json({ message: "Error finding user" });
	}
};


module.exports = {
	UserScheme,
	addUser,
	updateUser,
	deleteUser,
	login,
	getBookingOfUser,
	getUserById,
};

