const express = require("express");
const userRouter = express.Router();
const {
	UserScheme,
	addUser,
	updateUser,
	deleteUser,
	login,
	getBookingOfUser,
	getUserById,
} = require("../controllers/UserController.js");
userRouter.get("/", UserScheme);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", addUser);
userRouter.post("/login", login);
userRouter.put("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.get("/bookings/:id", getBookingOfUser);


module.exports=userRouter;