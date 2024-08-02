import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const productSchema = new Schema({
    name:  {type: String },
    image: {type: String },
    rating: {type: String },
    description: {type: String },
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
},
{
    timestamps: true
});

productSchema.plugin(toJSON)

export const productModel = model ('Product', productSchema)  
