import { Joi } from 'express-validation';

export const JoiValidators = {
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required(),
};
