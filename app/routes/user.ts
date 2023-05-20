import express from "express";
import Joi from "joi";
import { User } from "../utilities/interface";
import { Users, validateUpdateUser, validateUser } from "../models/user.model";
import { HTTP_STATUS_CODE } from "./../utilities/constant";

const router = express.Router();


//create user
router.post("/", async (req, res) => {
	try {
		const { error } = validateUser(req.body);

		if (error) {
			return res.status(HTTP_STATUS_CODE["Bad Request"]).send({message: error.details[0].message});
		} 

  const oldUser = await Users.findOne({email: req.body.email})
  if(oldUser) return res.status(HTTP_STATUS_CODE["Bad Request"]).send({message: "User already exists"}) 

		const lastItem = await Users.findOne().sort({ date: -1 }).limit(1).select("id").exec();

		const user = new Users({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			id: lastItem ? lastItem.id + 1 : 1,
		});

		await user.save();
  const {password, ...restUser} = user.toObject(); 

		return res.status(HTTP_STATUS_CODE["Created"]).send({data: restUser, message: "User created successfully"});
	} catch (error) {
		res.status(HTTP_STATUS_CODE["Internal Server Error"]).send({ message: error.message, data: [] });
	}
});

export default router;
