import { model, Schema } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";

const userSchema = new Schema({
    name:{type: String, required:true},
    username:{type: String, unique:true,required:true}, 
    email:{type: String, required:true, unique:true},
    phone: {type: String, unique:true},
   password:{type: String, required:true},
},
{
    timestamps: true
});

userSchema.plugin(toJSON)

export const userModel = model ('User', userSchema)