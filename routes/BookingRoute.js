const express = require("express");
const { newBooking, deleteBooking } = require("../controllers/bookingController");
const bookingRouter = express.Router();


bookingRouter.get("/:id", newBooking)
bookingRouter.post("/", newBooking);
bookingRouter.delete("/:id", deleteBooking);

module.exports = bookingRouter