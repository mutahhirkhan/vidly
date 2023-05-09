import express from "express";
import Joi from "joi";
import { Genre } from "../utilities/interface";
import { Genres, validateGenre, validateUpdateGenre } from "../models/genre.model";
import { HTTP_STATUS_CODE } from "./../utilities/constant";

const router = express.Router();

export const makeupGenre = async (name: string) => {
	try {
		
		const lastItem = await Genres.findOne().sort({ date: -1 }).limit(1).select("id").exec();
		const unsavedGenre = new Genres({
			name,
			id: lastItem ? lastItem.id + 1 : 1,
		});
	
		return {unsavedGenre}
	} catch (error) {
		return {error}
	}
}

router.get("/", async (_, res) => {
	const genres = await Genres.find().sort("date");
	if (genres.length === 0) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "No genre found", data: [] });
	res.status(HTTP_STATUS_CODE["OK"]).send({ data: genres, count: genres.length, message: "Success" });
});

//get genre by id
router.get("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const genreById = await Genres.findOne({ id });

		if (!genreById) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Genre not found", data: [] });

		res.status(HTTP_STATUS_CODE["Found"]).send(genreById);
	} catch (error: any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message, data: [] });
	}
});

//add new genre
router.post("/", async (req, res) => {
	try {
		const { error } = validateGenre(req.body);

		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const { name } = req.body;

		const {unsavedGenre, ...rest } = await makeupGenre(name);
		// const lastItem = await Genres.findOne().sort({ date: -1 }).limit(1).select("id").exec();

		// console.log("last item", lastItem);

		// const genre = new Genres({
		// 	name,
		// 	id: lastItem ? lastItem.id + 1 : 1,
		// });

		const savedGenre = await unsavedGenre.save();

		res.status(HTTP_STATUS_CODE["Created"]).send({ data: savedGenre, message: "Genre added" });
	} catch (error: any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

//update genre
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { error } = validateGenre(req.body);

		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const genreById = await Genres.findOne({ id });

		if (!genreById) return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Genre not found", data: [] });

		const { name } = req.body;

		const updatedGenre = await Genres.updateOne({ id }, { $set: { name } });

		res.status(HTTP_STATUS_CODE["OK"]).send({ data: updatedGenre, message: "Genre updated" });
	} catch (error: any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

//delete genre
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const schema = Joi.number().integer().greater(0).required();

		const { error } = schema.validate(id);
		if (error) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.details[0].message });

		const deletedMovie = await Genres.deleteOne({ id });

		if (deletedMovie.acknowledged && deletedMovie.deletedCount === 0)
			return res.status(HTTP_STATUS_CODE["Not Found"]).send({ message: "Genre not found", data: [] });

		res.status(HTTP_STATUS_CODE["No Content"]).send({ data: deletedMovie, message: "Genre deleted" });
	} catch (error: any) {
		return res.status(HTTP_STATUS_CODE["Bad Request"]).send({ message: error.message });
	}
});

export default router;
