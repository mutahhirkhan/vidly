import mongoose, { Schema, mongo } from "mongoose";
import Joi from "joi";
import { Rental } from "../utilities/interface";

const rentalSchema = new mongoose.Schema({
 
 /**
  * not embedding or referencing customer model. because we don't need every single detail of customer
  * just in case, if required then, we'll query using `_id`. storing only mandatory record.
  */
 customer: {
  type: new mongoose.Schema({
   name: { type: String, required: true, minlength: 1, maxlength: 50 },
   isGold: { type: Boolean, default: false },
   phone: { type: String, required: true, minlength: 1, maxlength: 50 }
  }),
  required: true
 },
 
  /**
  * not embedding or referencing movie model. because we don't need every single detail of movie
  * just in case, if required then, we'll query using `_id`. storing only mandatory record.
  */
 movie: {
  type: new mongoose.Schema({
   title: { type: String, required: true, trim: true, minlength: 1, maxlength: 255 },
   dailyRentalRate: { type: Number, required: true, min: 0, max: 255 }
  }),
  required: true
 },

 //automatically set when any new movie is rented.
 dateOut: { type: Date, required: true, default: Date.now },
 
 //set, when movie is returned and after return, we'll calculate the fee so far.
 //that is why not marked as `required: true`.
 dateReturned: { type: Date },
 rentalFee: { type: Number, min: 0 },
 id: { type: Number, required: true }
});

export const validateRental = (rentalDetails: Rental) => {
 const schema = Joi.object({
		movieId: Joi.number().integer().greater(0).required(),
		customerId: Joi.number().integer().greater(0).required(),
 })

 return schema.validate(rentalDetails)
}

export const Rentals = mongoose.model("Rental", rentalSchema);