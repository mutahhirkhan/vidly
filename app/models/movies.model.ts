import Joi, { object } from "joi";
import mongoose from "mongoose";
import { Movie } from "../utilities/interface";
import { genreSchema } from "./genre.model";
// import JoiObjectId from "joi-oid";
import { Types } from "mongoose";

const movieSchema = new mongoose.Schema({
	id: { type: Number, required: true },

	title: { type: String, required: true, lowercase: true, trim: true, minLength: 1, maxLength: 50 },
	genre: { type: genreSchema, required: true },
	
	dailyRentalRate: { type: Number, required: true, 	
		validate : {
			validator : Number.isInteger,
			message   : '{VALUE} is not an integer value' 
		} 
	},
	
	numberInStock: { type: Number, required: true, 
		validate : {
			validator : Number.isInteger,
			message   : '{VALUE} is not an integer value' 
		}
	},

	length: { type: Number, required: true, get: (v: number) => Math.round(v), set: (v: number) => Math.round(v) },
	date: { type: Date, required: true, default: Date.now },
});

export const validateMovie = (movie: Movie): Joi.ValidationResult<Movie> => {
	const schema = Joi.object({
		title: Joi.string().required().min(1).max(50),
		genre: Joi.string(),
		dailyRentalRate: Joi.number().integer().greater(0).required(),
		numberInStock: Joi.number().integer().greater(0).required(),

		// genre: Joi.string().required().min(1).max(50),
		length: Joi.number().integer().greater(0).optional(),
	});

	return schema.validate(movie);
};

export const validateUpdateMovie = (movie: Movie): Joi.ValidationResult<Movie> => {
	const schema = Joi.object({
		title: Joi.string().min(1).max(50).optional(),
		// genre: JoiObjectId.objectId(),
		genre: Joi.string(),

		dailyRentalRate: Joi.number().integer().greater(0).optional(),
		numberInStock: Joi.number().integer().greater(0).optional(),

		// genre: Joi.string().min(1).max(50).optional(),
		length: Joi.number().integer().greater(0).optional().optional(),
	});

	return schema.validate(movie);
};

export const Movies = mongoose.model("movie", movieSchema);
