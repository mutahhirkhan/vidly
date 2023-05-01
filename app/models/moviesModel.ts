import { connectionString } from "../utilities/constant";
import mongoose from "mongoose";
// import AutoIncrementFactory from 'mongoose-sequence';
// const AutoIncrementFactory = require('mongoose-sequence')(mongoose);

// const autoIncrement = AutoIncrementFactory(mongoose.connection);

const movieSchema = new mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true, lowercase:	true, trim: true },
	genre: { type: String, required: true, lowercase: true, trim: true },
	length: { type: Number, required: true, get: (v: number) => Math.round(v), set: (v: number) => Math.round(v) },
	date: {	type: Date, required: true, default: Date.now },
});


//auto id for mongo schema
// movieSchema.plugin(AutoIncrementFactory, { inc_field: 'id', start_seq: 1 });

export const Movies = mongoose.model("movie", movieSchema);
