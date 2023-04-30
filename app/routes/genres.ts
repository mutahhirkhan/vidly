import mongoose from "mongoose";
import express from "express";
import Joi, { string } from "joi";
import { Movies } from "./../models/moviesModel";

const router = express.Router();

const HTTP_STATUS_CODE = {
	Continue: 100,
	"Switching Protocols": 101,
	Processing: 102,
	"Early Hints": 103,
	OK: 200,
	Created: 201,
	Accepted: 202,
	"Non-Authoritative Information": 203,
	"No Content": 204,
	"Reset Content": 205,
	"Partial Content": 206,
	"Multi-Status": 207,
	"Already Reported": 208,
	"IM Used": 226,
	"Multiple Choices": 300,
	"Moved Permanently": 301,
	Found: 302,
	"See Other": 303,
	"Not Modified": 304,
	"Temporary Redirect": 307,
	"Permanent Redirect": 308,
	"Bad Request": 400,
	Unauthorized: 401,
	"Payment Required": 402,
	Forbidden: 403,
	"Not Found": 404,
	"Method Not Allowed": 405,
	"Not Acceptable": 406,
	"Proxy Authentication Required": 407,
	"Request Timeout": 408,
	Conflict: 409,
	Gone: 410,
	"Length Required": 411,
	"Precondition Failed": 412,
	"Payload Too Large": 413,
	"URI Too Long": 414,
	"Unsupported Media Type": 415,
	"Range Not Satisfiable": 416,
	"Expectation Failed": 417,
	"I'm a teapot": 418,
	"Misdirected Request": 421,
	"Unprocessable Entity": 422,
	Locked: 423,
	"Failed Dependency": 424,
	"Too Early": 425,
	"Upgrade Required": 426,
	"Precondition Required": 428,
	"Too Many Requests": 429,
	"Request Header Fields Too Large": 431,
	"Unavailable For Legal Reasons": 451,
	"Internal Server Error": 500,
	"Not Implemented": 501,
	"Bad Gateway": 502,
	"Service Unavailable": 503,
	"Gateway Timeout": 504,
	"HTTP Version Not Supported": 505,
	"Variant Also Negotiates": 506,
	"Insufficient Storage": 507,
	"Loop Detected": 508,
	"Not Extended": 510,
};

//get all movies
router.get("/", async (_, res) => {
	const movies = await Movies.find();
	res.status(HTTP_STATUS_CODE["OK"]).send({ data: movies, count: movies.length, message: "Success" });
});

//get movie by id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const movieByGenreId = await Movies.findOne({ id });
		// const movieByGenreId = movies.find((movie) => movie.id === parseInt(id));

		if (!movieByGenreId) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found", data: [] });

		res.status(HTTP_STATUS_CODE["Found"]).send(movieByGenreId);
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message, data: [] });
	}
});

//add new movie
router.post("/", async (req, res) => {
	try {
		const schema = Joi.object({
				name: Joi.string().required(),
				genre: Joi.string().required(),
				length: Joi.number().integer().greater(0).optional(),
			}),
			{ error } = schema.validate(req.body);

		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const { name, genre, length } = req.body;
		const lastItem = await Movies.findOne().sort({ date: -1 }).limit(1).select("id").exec();

		const movie = new Movies({
			name,
			genre,
			length,
			id: lastItem ? lastItem.id + 1 : 1,
		});

		const savedMovie = await movie.save();

		res.status(HTTP_STATUS_CODE["Created"]).send({ data: savedMovie, message: "Movie added" });
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

//update movie
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const reqBody = req.body;

		const paramSchema = Joi.number().integer().greater(0).required();
		const payloadSchema = Joi.object({
			name: Joi.string().optional(),
			genre: Joi.string().optional(),
			length: Joi.number().integer().greater(0).optional(),
		});

		const { error: paramError } = paramSchema.validate(id);
		const { error: payloadError } = payloadSchema.validate(reqBody);

		if (paramError) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: paramError?.details[0].message });
		else if (payloadError) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: payloadError?.details[0].message });

		const movie = await Movies.findOneAndUpdate({ id }, reqBody);

		if (!movie) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found" });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: movie, message: "Movie updated" });
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

//delete movie by id
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const deletedMovie = await Movies.deleteOne({ id });

		if (deletedMovie.acknowledged && deletedMovie.deletedCount === 0) 
			return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found", data: [] });

			res.status(HTTP_STATUS_CODE["No Content"]).send({ data: deletedMovie, message: "Movie deleted" });
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

//delete all  movies
router.delete("/", async (_, res) => {
	try {

		const deletedMovies = await Movies.deleteMany({});

		if (deletedMovies.acknowledged && deletedMovies.deletedCount === 0) 
			return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found", data: [] });
		
		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: deletedMovies, message: "Movies deleted" });
	
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

export default router;
