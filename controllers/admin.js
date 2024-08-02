import { userModel } from "../models/usermodel.js"

export const createUser = async (res, req, next) => {
    try {
        const user = await userModel.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


export const updateUser = async (res, req, next) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}