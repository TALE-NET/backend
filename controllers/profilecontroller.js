import { profileSchema } from "../schema/profile.js";
import { userModel } from "../models/usermodel.js";
import { profileModel } from "../models/profilemodel.js";

export const newUserProfile = async (req, res, next) => {
    try {
        // Validate data provided by user
        const { error, value } = profileSchema.validate({
            ...req.body,
            image: req.file.filename
        });
        if (error) {
            return res.status(400).send(error.details[0].message)
        }

        // Retrieve user session
        const userId = req.session?.user?.id || req?.user?.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('User Profile not found')
        }

        // Create user profile
        const profile = await profileModel.create({ ...value, user: userId });
        user.profileModel = profile._id

        await user.save()
        // Return response
        return res.status(201).json({message: 'User Profile created successfully', profile })
    } catch (error) {
        next(error)
    }
}

// Function to update a user profile
export const updateUserProfile = async (req, res) => {
    try {
        const updateFields = { ...req.body };

        if (req.file.filename) {
            updateFields.image = req.file.filename;
        } else if (req.files?.image) {
            updateFields.image = req.file.filename;
        }

        // Validate data provided by user
        const { error, value } = profileSchema.validate({updateFields});
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Retrieve user session
        const userId = req.session?.user?.id || req?.user?.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('User Profile not found');
        }
        // Update user profile by id
        const profile = await profileModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!profile) {
            return res.status(404).send('Profile not found');
        }
        // Return response
        return res.status(200).json({message: 'User Profile updated successfully', profile })
    } catch (error) {
        console.log(error);
    }
};


// Function to get the user profile
export const getUserProfile = async (req, res) => {
    try {
        // Retrieve user session or request
        const userId = req.session?.user?.id || req?.user?.id;
        // Get user profile 
        const profile = await userModel.findById({ user: userId }).populate({
            path: 'user',
            select: '-password'
        });
        if (!profile) {
            return res.status(404).send({ profile });
        }
        // Return response
       return res.status(200).json({ profile });
    } catch (error) {
        return res.status(500).json({ error })
    }
}


export const deleteProfile = async (req, res, next) => {
    try {
     
  
      const id = req.session?.user?.id || req?.user?.id; 
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const event = await eventModel.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).send("Event not found");
        }
  
        user.event.pull(req.params.id);
        await user.save();

        return res.status(200).json({message: "Event deleted"});
    } catch (error) {
      // return res.status(500).json({error})
      next(error)
    }
  };
  