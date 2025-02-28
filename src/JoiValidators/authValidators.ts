// Importing Joi for validation
import Joi from 'joi'; 

export const loginSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(3).required()
});