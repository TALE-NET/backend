import { model, Schema, Types } from "mongoose";
import { toJSON } from "@reis/mongoose-to-json";
import mongooseErrors from "mongoose-errors";


const userSchema = new Schema({
   firstname: {type: String },
   lastname: {type: String },
   othernames: {type: String },
   email: {type: String, unique: true },
   password: {type: String },
   confirmpassword: {type: String },
   username: {type: String, unique: true },
   googleId: { type: String }, 
   products: [{ type: Types.ObjectId, ref: 'Product' }],
   gallery: [{ type: Types.ObjectId, ref: 'Gallery' }],
   profile: [{ type: Types.ObjectId, ref: 'Profile' }],
   company: [{ type: Types.ObjectId, ref: 'Company' }],
   event: [{ type: Types.ObjectId, ref: 'Event' }],
   role: {type: String, default: 'user',enum: ['admin','vendor','user']}
},
{
    timestamps: true
});

const resetTokenSchema = new Schema({
    userId: { type: Types.ObjectId, required: true, ref: 'User' },
    expired: { type: Boolean, default: false },
    expiresAt: {
        type: Date,
        default: () => new Date().setHours(new Date().getHours() + 2)
    }
}, {
    timestamps: true
});

// Apply plugins
userSchema
    .plugin(mongooseErrors)
    .plugin(toJSON);
resetTokenSchema
    .plugin(mongooseErrors)
    .plugin(toJSON);

export const userModel = model ('User', userSchema)
export const ResetTokenModel = model('ResetToken', resetTokenSchema);