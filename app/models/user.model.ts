import mongoose from "mongoose";
import Joi from "joi";
import { User } from "../utilities/interface";

export const userSchema = new mongoose.Schema({
	name: { type: String, required: true, lowercase: true, trim: true, minLength: 1, maxLength: 50 },
	id: { type: Number, required: true },
	date: { type: Date, required: true, default: Date.now },
 email: { type: String, required: true, lowercase: true, trim: true, minLength: 5, maxLength: 255, unique: true },
 password: { type: String, required: true, minLength: 5, maxLength: 1024 },

});

export const validateUser = (user: User): Joi.ValidationResult<User> => {
	const schema = Joi.object({
		name: Joi.string().required().min(1).max(50),
  email: Joi.string().required().min(5).max(255).email(),
  password: Joi.string().required().min(5).max(1024),//it will be plain text so we need to hash it

	});

	return schema.validate(user);
};

export const validateUpdateUser = (user: User): Joi.ValidationResult<User> => {
	const schema = Joi.object({
		name: Joi.string().min(1).max(50).optional(),
  email: Joi.string().min(5).max(255).email().optional(),
  password: Joi.string().min(5).max(1024).optional(),//it will be plain text so we need to hash it
	});

	return schema.validate(user);
};

export const Users = mongoose.model("user", userSchema);
