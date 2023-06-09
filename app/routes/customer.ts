import express from "express";
import Joi from "joi";
import { Customers, validateCustomer, validateUpdateCustomer } from "../models/customer.model";
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
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Gateway"]).send({ message: error.message, data: [] });
	}
});

//add new customer
router.post("/", async (req, res) => {
	try {
		const { error } = validateCustomer(req.body);

		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const { name, isGold, phone } = req.body;
		const lastItem = await Customers.findOne().sort({ date: -1 }).limit(1).select("id").exec();

		const customer = new Customers({
			name,
			isGold,
			phone,
			id: lastItem ? lastItem.id + 1 : 1,
		});

		await customer.save();

		res.status(HTTP_STATUS_CODE["Created"]).send({ data: customer, message: "Customer added" });
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Gateway"]).send({ message: error.message });
	}
});

//update customer by id
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const reqBody = req.body;

		const schema = Joi.number().integer().greater(0).required();

		const { error: paramError } = schema.validate(id);
		const { error: payloadError } = validateUpdateCustomer(reqBody);

		if (paramError) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: paramError?.details[0].message });
		else if (payloadError) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: payloadError?.details[0].message });

		//new: true => return the updated object
		const customer = await Customers.findOneAndUpdate({ id }, reqBody, { new: true });
		if (!customer) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Customer not found", data: [] });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: customer, message: "Customer updated" });
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Gateway"]).send({ message: error.message, data: [] });
	}
});

//delete customer by id
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const customer = await Customers.findOneAndDelete({ id });
		if (!customer) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Customer not found", data: [] });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: customer, message: "Customer deleted" });
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Gateway"]).send({ message: error.message, data: [] });
	}
});

//delete all  customers
router.delete("/", async (_, res) => {
	try {
		const customers = await Customers.deleteMany();
		if (!customers) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Customers not found", data: [] });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: customers, message: "Customers deleted" });
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message, data: [] });
	}
});

export default router;
