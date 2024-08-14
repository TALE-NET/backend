import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const gallerySchema = new Schema({
    image:{type: String, required: true},
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
},
{
    timestamps: true
});

gallerySchema.plugin(toJSON)

export const galleryModel = model ('Gallery', gallerySchema)  
