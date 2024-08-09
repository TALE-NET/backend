import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const eventSchema = new Schema({
    image:{type: String },
    name:{type: String },
    type:{type: String },
    description:{type: String },
    date:{type: String },
    time:{type: String },
    createdBy: { type: Types.ObjectId, required: true, ref: 'User' },
},
{
    timestamps: true
});

eventSchema.plugin(toJSON)

export const eventModel = model ('Event', eventSchema)  
