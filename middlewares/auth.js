import jwt from "jsonwebtoken";
import { userModel } from "../models/usermodel.js";
import { roles } from "../config/roles.js";

export const auth = (req, res, next) => {
 try {
       // Check if session has a user
       if (req.session.user){
           next();
       } else if (req.headers.authorization){
           try {
               // Extract token from headers 
               const token = req.headers.authorization.split(' ')[1];           
               // Verify the token to get the user and append the user to the request
               req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
               // Call next function
               next();
           } catch (error) {
               return res.status(401).json({error: 'Token Expired'});
           }
       } else {
           res.status(401).json({ error: 'User not authenticated' })
       }
 } catch (error) {
    next(error);
 }
}

export const hasPermission = (permission) => {
  return async (req, res, next) =>{
 try {
       // Get user id from session or request
       const id = req.session?.user?.id || req?.user?.id;
       // Find user  by id 
       const user = await userModel.findById(id);
       // Find user role with permission
   const useRole  = roles.find(element => element.role === user.role);
       // Use role to check if user has permission
   if(useRole && useRole.permissions.includes(permission)){
     next();
   }else{
       res.status(403).json({error: 'User is not authorized!' })
      } 
   
 } catch (error) {
    next(error);
 }
}  
}