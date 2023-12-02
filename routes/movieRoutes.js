const express = require("express");
const movieeRouter = express.Router();
const {addMovie, getMovie, getMovieById} = require("../controllers/MovieController")
movieeRouter.post("/", addMovie);
movieeRouter.get("/", getMovie);
movieeRouter.get("/:id", getMovieById);
module.exports= movieeRouter