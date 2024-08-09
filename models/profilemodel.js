import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const profileSchema = new Schema({
    name: {type: String },
    image: {type: String },
    phone: {type: String },
    bio:{type: String },
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
},
{
    timestamps: true
});

profileSchema.plugin(toJSON)

export const profileModel = model ('Profile', profileSchema)  
