import joi from "joi"


export const userSchema = joi.object({
    firstname:joi.string().required(),
    lastname:joi.string().required(),
    othernames:joi.string(),
    email:joi.string().email().required(),
    password: joi.string().min(4).required(),
    confirmpassword: joi.ref('password'),
    username: joi.string().required(),
    googleId: joi.string(),
  }).with('password', 'confirmpassword');

export const loginValidator = joi.object({
    username: joi.string().alphanum(),
    email: joi.string().email(),
    password: joi.string().required(),
});

export const forgotPasswordValidator = joi.object({
  email: joi.string().email().required(),
});

export const resetPasswordValidator = joi.object({
  resetToken: joi.string().required(),
  password: joi.string().required(),
  confirmPassword: joi.string().valid(joi.ref('password')).required(),
});

export const createUserValidator = joi.object({
  name: joi.string().required(),
  username: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  role: joi.string().required().valid('admin', 'manager'),
});

export const updateUserValidator = joi.object({
  name: joi.string(),
  role: joi.string().valid('admin', 'manager'),
});