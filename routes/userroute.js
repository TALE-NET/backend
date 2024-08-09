import { getUser, updateUser, signup, logout, tokenLogin, getUsers, sessionLogin, forgotPassword, resetPassword, verifyResetToken, deleteUser, createUser } from "../controllers/usercontroller.js";
import { Router } from "express";
import { auth, hasPermission } from "../middlewares/auth.js";
import passport from 'passport';

// Create router
export const userRouter = Router();

// Define routes
userRouter.post('/users/signup', signup);

userRouter.post('/users/login', sessionLogin);

userRouter.post('/users/token', tokenLogin);

userRouter.post('/users/logout', auth, logout);

userRouter.post('/users/forgot-password', forgotPassword);

userRouter.post('/users/reset-password', resetPassword);

userRouter.get('/users/profile', auth, getUser);

userRouter.get('/users/verify-reset-password/:id', verifyResetToken);

userRouter.get('/users', auth, hasPermission('read_users'), getUsers);

userRouter.post('/users', auth, hasPermission('create_user'), createUser);

userRouter.patch('/users/:id', updateUser);

userRouter.delete('/users/:id', auth, hasPermission('delete_user'), deleteUser);


// Google OAuth routes
userRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
