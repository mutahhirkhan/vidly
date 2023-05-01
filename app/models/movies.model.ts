import Joi from "joi";
import mongoose from "mongoose";
import { Movie } from "../utilities/interface";

const movieSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true, lowercase: true, trim: true, minLength:1,  maxLength: 50 },
	genre: { type: String, required: true, lowercase: true, trim: true, minLength: 1, maxLength: 50 },
	length: { type: Number, required: true, get: (v: number) => Math.round(v), set: (v: number) => Math.round(v) },
	date: { type: Date, required: true, default: Date.now },
});

export const validateMovie = (movie: Movie) : Joi.ValidationResult<Movie> => {
	const schema = Joi.object({
		name: Joi.string().required().min(1).max(50),
		genre: Joi.string().required().min(1).max(50),
		length: Joi.number().integer().greater(0).optional(),
	});

	return schema.validate(movie);
};

export const Movies = mongoose.model("movie", movieSchema);
