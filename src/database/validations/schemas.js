import joi from "joi";
import { emailRegex, strongPasswordRegex, cepRegex } from "./regex.js";

const usersSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().pattern(new RegExp(emailRegex)).required(),
    password: joi.string().pattern(new RegExp(strongPasswordRegex)).required(),
});

const subscriptionSchema = joi.object({
    userId: joi.number().min(1).required(),
    cep: joi.string().max(8).pattern(new RegExp(cepRegex)).required(),
    city: joi.string().required(),
    startDate: joi.date().iso().required(),
    deliveryAddress: joi.string().required(),
    plan: joi.string().required(),
    products: joi.array().required(),
    state: joi.string().min(2).max(2).required(),
    userFullName: joi.string().required(),
});

export { usersSchema, subscriptionSchema };
