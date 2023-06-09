import express from "express";
import Joi from "joi";
import { Movies, validateMovie, validateUpdateMovie } from "../models/movies.model";
import { HTTP_STATUS_CODE } from "../utilities/constant";
import { Genres } from "../models/genre.model";
import { makeupGenre } from './genre';

const router = express.Router();

router.get("/", async (_, res) => {
	const movies = await Movies.find().sort("title");
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

		if (!movieByGenreId) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found", data: [] });

		res.status(HTTP_STATUS_CODE["Found"]).send(movieByGenreId);
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message, data: [] });
	}
});

//add new movie
router.post("/", async (req, res) => {
	try {

		const { error } = validateMovie(req.body);

		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const { title, genre, length, dailyRentalRate, numberInStock } = req.body;
		
		const genreById = await Genres.findById(genre).select("name id").exec();		
		if (!genreById) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Genre not found", data: [] });


		const lastItem = await Movies.findOne().sort({ date: -1 }).limit(1).select("id").exec();

		const movie = new Movies({
			title,
			genre : {
				_id: genreById._id,
				name: genreById.name,
				id: genreById.id,
		},
			length,
			id: lastItem ? lastItem.id + 1 : 1,
			dailyRentalRate,
			numberInStock,
		});

		//becuase object has been prepared by mongoose earlier
		await movie.save();

		res.status(HTTP_STATUS_CODE["Created"]).send({ data: movie, message: "Movie added" });
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

//update movie
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		let reqBody = req.body;

		const { error: payloadError } = validateUpdateMovie(reqBody);

		const paramSchema = Joi.number().integer().greater(0).required();
		const { error: paramError } = paramSchema.validate(id);

		if (paramError) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: paramError?.details[0].message });
		else if (payloadError) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: payloadError?.details[0].message });

		//get genre by id
		if(reqBody.genre) {
			console.log('updating genre');
			const genreById = await Genres.findById(reqBody.genre).select("name id").exec();		
			if (!genreById) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Genre not found", data: [] });
			
			//add genre to reqBody object
			reqBody = {
				...reqBody,
				genre : {
					_id: genreById._id,
					name: genreById.name,
					id: genreById.id,
				}
			}
		}
		
		//new: true => return the updated object
		const movie = await Movies.findOneAndUpdate({ id }, reqBody, { new: true });

		if (!movie) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Movie not found" });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: movie, message: "Movie updated" });
	} catch (error:any) {
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
	} catch (error:any) {
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
	} catch (error:any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

export default router;
