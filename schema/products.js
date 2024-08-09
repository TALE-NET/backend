import joi from "joi";

export const productSchema = joi.object({
    productName: joi.string(),
    gallery: joi.string().required(),
    description: joi.string(),
    category: joi.string().required(),
    brandName: joi.string().required(),
    sKU: joi.string(),
    stockQuantity: joi.string().required(),
    regularPrice: joi.string().required(),
    salePrice: joi.string().required(),
    tag: joi.string(),
    user:joi.string()
})   


