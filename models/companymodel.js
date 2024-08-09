import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const companySchema = new Schema({
    image:{type: String},
    brandName:{type: String},
    category:{type: String},
    brandDescription:{type: String},
    inspiration:{type: String},
    instagram: {type: String},
    twitter: {type: String},
    tiktok: {type: String},
    facebook: {type: String},
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
},
{
    timestamps: true
});

companySchema.plugin(toJSON)

export const companyModel = model ('Company', companySchema)  
