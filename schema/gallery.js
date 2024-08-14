import joi from "joi";

export const gallerySchema = joi.object({
    image: joi.string().required(),
    user:joi.string()
})   

