const express = require("express");
const app = express();
app.use(express.json())
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const adminRouter= require("./routes/adminRoutes.js")
const userRouter  = require("./routes/User-routes.js");
const movieeRouter = require("./routes/movieRoutes.js");
const bookingRouter = require("./routes/BookingRoute.js");
dotenv.config();
app.use(cors());


mongoose
	.connect(
		`mongodb+srv://syedahamad1976:${process.env.mongo_pass}@cluster0.ssqjepo.mongodb.net/college?retryWrites=true&w=majority`
	)
	.then(() => {
		console.log("Successfully connected");
	})
	.catch((e) => {
		console.log("error at conecting db " + e);
    });
    
    app.use("/user",userRouter)
    app.use("/admin",adminRouter)
app.use("/movie", movieeRouter)

	app.use("/booking", bookingRouter);


app.listen(5000,()=> {
    console.log("port is runing on 5000");
})
