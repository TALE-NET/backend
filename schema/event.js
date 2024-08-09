import joi from "joi";

export const eventSchema = joi.object({
    image: joi.string().required(),
    name: joi.string().required(),
    type: joi.string().required(),
    description: joi.string().required(),
    date: joi.string().required(),
    time: joi.string().required(),
    user:joi.string()
})   
