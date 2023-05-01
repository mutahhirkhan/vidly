import Joi from "joi";
import mongoose from "mongoose";
import { Customer } from "../utilities/interface";

const customerSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true, lowercase: true, trim: true, minLength: 5, maxLength: 50 },
	phone: { type: String, required: true, lowercase: true, trim: true, minLength: 5, maxLength: 50 },
	isGold: { type: Boolean, required: true },
	date: { type: Date, required: true, default: Date.now },
});

export const validateCustomer = (customer: Customer) : Joi.ValidationResult<Customer> => {
	const schema = Joi.object({
		name: Joi.string().required().min(5).max(50),
		phone: Joi.string().required().min(5).max(50),
		isGold: Joi.boolean(),
	});

	return schema.validate(customer);
};

export const Customers = mongoose.model("customer", customerSchema);
