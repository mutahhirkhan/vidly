import express from "express";
import Joi from "joi";
import { Movies, validateMovie } from "../models/movies.model";
import { HTTP_STATUS_CODE } from "../utilities/constant";

const router = express.Router();

router.get("/", async (_, res) => {
	const movies = await Movies.find().sort("name");
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

		const { error } = validateMovie(req.body);

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

		const { error: payloadError } = validateMovie(req.body);

		const paramSchema = Joi.number().integer().greater(0).required();
		const { error: paramError } = paramSchema.validate(id);

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
			return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movies not found", data: [] });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: deletedMovies, message: "Movies deleted" });
	} catch (error) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

export default router;
