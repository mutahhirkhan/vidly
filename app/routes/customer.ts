import express from "express";
import Joi from "joi";
import {Customers, validateCustomer} from "../models/customer.model";
import { HTTP_STATUS_CODE } from "../utilities/constant";

const router = express.Router();

router.get("/", async (_, res) => {
	const customers = await Customers.find().sort("name");
	res.status(HTTP_STATUS_CODE["OK"]).send({ data: customers, count: customers.length, message: "Success" });
});

//get customer by id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const customerByGenreId = await Customers.findOne({ id });
		// const customerByGenreId = customers.find((customer) => customer.id === parseInt(id));

		if (!customerByGenreId) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Customer not found", data: [] });

		res.status(HTTP_STATUS_CODE["Found"]).send(customerByGenreId);
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message, data: [] });
	}
});


export default router;