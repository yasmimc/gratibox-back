import joi from "joi";
import { emailRegex, strongPasswordRegex } from "./regex.js";

const usersSchema = joi.object({
	name: joi.string().min(3).required(),
	email: joi.string().pattern(new RegExp(emailRegex)).required(),
	password: joi.string().pattern(new RegExp(strongPasswordRegex)).required(),
});

export { usersSchema };
