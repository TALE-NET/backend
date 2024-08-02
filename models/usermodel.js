import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema({
   firstname: {type: String },
   lastname: {type: String },
   othernames: {type: String },
   email: {type: String, unique: true },
   password: {type: String },
   confirmpassword: {type: String },
   username: {type: String, unique: true },
   products: [{ type: Types.ObjectId, ref: 'Product' }],
   role: {type: String, default: 'user',enum: ['admin','vendor','user']}
},
{
    timestamps: true
});

userSchema.plugin(toJSON)

export const userModel = model ('User', userSchema)