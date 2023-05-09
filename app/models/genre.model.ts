import mongoose from "mongoose";
import Joi from "joi";
import { Genre } from "../utilities/interface";

export const genreSchema = new mongoose.Schema({
	name: { type: String, required: true, lowercase: true, trim: true, minLength: 1, maxLength: 50 },
	id: { type: Number, required: true },
	date: { type: Date, required: true, default: Date.now },


});

export const validateGenre = (genre: Genre): Joi.ValidationResult<Genre> => {
	const schema = Joi.object({
		name: Joi.string().required().min(1).max(50),
	});

	return schema.validate(genre);
};

export const validateUpdateGenre = (genre: Genre): Joi.ValidationResult<Genre> => {
	const schema = Joi.object({
		name: Joi.string().min(1).max(50).optional(),
	});

	return schema.validate(genre);
};

export const Genres = mongoose.model("genre", genreSchema);
