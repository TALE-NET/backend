import joi from "joi";

export const companySchema = joi.object({
    image: joi.string().required(),
    brandName: joi.string().required(),
    category: joi.string().required(),
    brandDescription: joi.string().required(),
    inspiration: joi.string().required(),
    instagram: joi.string(),
    twitter: joi.string(),
    tiktok: joi.string(),
    facebook: joi.string(),
    user:joi.string()
})   

