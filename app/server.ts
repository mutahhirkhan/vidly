import mongoose from "mongoose";
import express from "express";
import movies from "./routes/movie";
import home from "./routes/home";
import genres from "./routes/genre"
import customers from "./routes/customer";
import { connectionString, PORT } from "./utilities/constant";

const port = process.env.PORT || PORT;
const app = express();

console.log("dnnnnnnnnnnnnnnnnN");

mongoose
	.connect(connectionString, { dbName: "vidly", family: 4 })
	.then(() => console.log("Connected to MongoDB..."))
	.catch((err) => console.error("Could not connect to MongoDB...", err));

app.use(express.json());
app.use("/", home);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/customers", customers);


app.listen(port, () => console.log(`Listening on port ${port}`));
