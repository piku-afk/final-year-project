import { Joi } from 'express-validation';

export const JoiValidators = {
  user: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
  },
  election: {
    title: Joi.string().min(3).required(),
    description: Joi.string().min(5),
    start: Joi.date().min('now'),
    end: Joi.date().min('now'),
  },
};
