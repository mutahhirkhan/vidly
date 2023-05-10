import express from "express";
import Joi from "joi";
import { HTTP_STATUS_CODE } from "../utilities/constant";
import { Rentals, validateRental } from "../models/rental.model";
import { Customers } from "../models/customer.model";
import { Movies } from "../models/movies.model";

const router = express.Router();

router.get("/", async (_, res) => {
	try {
  //sorting in decending order based on dateOut
		const rentals = await Rentals.find().sort("-dateOut").exec();
		res.status(HTTP_STATUS_CODE["OK"]).send({ data: rentals, count: rentals.length, message: "Success" });
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const rentalById = await Rentals.findOne({ id });

		if (!rentalById) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Rental not found", data: [] });

		res.status(HTTP_STATUS_CODE["Found"]).send(rentalById);
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message, data: [] });
	}
})

router.post("/", async (req, res) => {
 try {
  const { error } = validateRental(req.body);
  if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

  //both are `id` not `_id` type `Number`
  const { customerId, movieId } = req.body;

  //check if customer is in record
  const customer = await Customers.findOne({ id: customerId }).select("name phone isGold id").exec();
  if (!customer) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Customer not found", data: [] });

  //check if movie is in record and stock
  const movie = await Movies.findOne({ id: movieId }).select("title dailyRentalRate id numberInStock").exec();
  if (!movie || (movie.numberInStock === 0)) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found or out of stock", data: [] });

  //get the last rented item sorted by dateOut in decending order
		const lastItem = await Rentals.findOne().sort({ dateOut: -1 }).limit(1).select("id").exec();


  const rental = new Rentals({
   customer: {
    _id: customer._id,
    name: customer.name,
    phone: customer.phone,
    isGold: customer.isGold,
    id: customer.id,
   },
   movie: {
    _id: movie._id,
    title: movie.title,
    dailyRentalRate: movie.dailyRentalRate,
    id: movie.id,
   },
			id: lastItem ? lastItem.id + 1 : 1,
  })

  const result = await rental.save();

  //decrement the numberInStock by 1
  await Movies.updateOne({ id: movieId }, { $inc: { numberInStock: -1 } });

  res.status(HTTP_STATUS_CODE["Created"]).send({ message: "Rental created successfully", data: result });


 } catch (error) {
  res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message })
 }
})

export default router;