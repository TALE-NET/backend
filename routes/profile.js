import { Router } from "express";
import { getUserProfile, newUserProfile, updateUserProfile,deleteProfile } from "../controllers/profilecontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";


// Create and export router
export const userProfileRouter = Router()


// Define routes
userProfileRouter.post('/users/profile', remoteUpload.single('image'), auth,newUserProfile);

userProfileRouter.patch('/users/profile/:id', remoteUpload.single('image'), auth, hasPermission('update_profile'),updateUserProfile);

userProfileRouter.get('/users/profile',getUserProfile);

userProfileRouter.delete('/users/profile',hasPermission('delete_profile'), deleteProfile);

