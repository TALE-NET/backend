import joi from "joi";

export const profileSchema = joi.object({
    name: joi.string(),
    image: joi.string().required(),
    phone: joi.string(),
    bio: joi.string().required(),
    user:joi.string()
})   
