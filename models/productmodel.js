import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const productSchema = new Schema({
    productName:{type: String },
    gallery:{type: String },
    description:{type: String },
    category:{type: String },
    brandName:{type: String },
    sKU:{type: String },
    stockQuantity:{type: String },
    regularPrice:{type: String },
    salePrice:{type: String },
    tag:{type: String },
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
},
{
    timestamps: true
});

productSchema.plugin(toJSON)

export const productModel = model ('Product', productSchema)  
