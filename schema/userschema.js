import joi from "joi"


export const userSchema = joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required(),
    othernames:joi.string(),
    email:joi.string().email().required(),
    password: joi.string().min(4).required(),
    confirmpassword: joi.ref('password'),
    username: joi.string().required()
  }
    
).with('password', 'confirmpassword');

export const loginValidator = joi.object({
    username: joi.string().alphanum(),
    email: joi.string().email(),
    password: joi.string().required(),
});