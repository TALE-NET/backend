import { getUser, patchUser, signup, logout, tokenLogin, getUsers, sessionLogin } from "../controllers/usercontroller.js";
import { Router } from "express";
import { auth} from "../middlewares/auth.js";


// Create router
export const userRouter = Router()


// Define routes
userRouter.post('/user/signup', signup);

userRouter.post('/user/session/login', sessionLogin);

userRouter.post('/user/logout', auth, logout);

userRouter.get('/user',auth, getUsers);

// Getting a user shows null in thunder client(seek help)
userRouter.get('/user/:username',auth, getUser);

userRouter.patch('/user/:id', patchUser);

userRouter.post('/user/token/login', tokenLogin)
