import Joi from "joi";

export const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("admin", "user").required(),
});

export const cardSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  image: Joi.string().uri().required(),
  description: Joi.string().required(),
  userId: Joi.number().required(),
});

export const tradeSchema = Joi.object({
  offeredCardId: Joi.number().required(),
  requestedCardId: Joi.number().required(),
  offeredUserId: Joi.number().required(),
  requestedUserId: Joi.number().required(),
});
