import joi from "joi";

export const productSchema = joi.object({
    name: joi.string(),
    image: joi.string().required(),
    rating: joi.string(),
    description: joi.string().required(),
    user:joi.string()
})   


