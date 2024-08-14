import { gallerySchema } from "../schema/gallery.js";
import { userModel } from "../models/usermodel.js";
import { galleryModel } from "../models/gallerymodel.js";

export const createGallery = async (req, res, next) => {
    try {
      const { error, value } = gallerySchema.validate({  
        ...req.body,
        // image: req.files?.image[0].fileName,
        images: req.files?.image?.map(file => file.fileName) || [],
      });
  
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const id = req.session?.user?.id || req?.user?.id;
     
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const gallery = await galleryModel.create({
          ...value, 
          user: id
       });
  // The products here is being referenced from the UserModel object created {gallery} there
      user.gallery.push(gallery._id)
  
      await user.save();
  
      return res.status(201).json({message: 'Gallery created successfully', gallery });
    } catch (error) {
      // console.log(error)
  next(error)
    }
  };
  

  // Function to update a gallery
export const updateGallery = async (req, res) => {
    try {
        const updateFields = { ...req.body };

        if (req.file.filename) {
            updateFields.image = req.file.filename;
        } else if (req.files?.image) {
            updateFields.image = req.file.filename;
        }

        // Validate data provided by user
        const { error, value } = gallerySchema.validate({updateFields});
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Retrieve user session
        const userId = req.session?.user?.id || req?.user?.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Update gallery by id
        const gallery = await galleryModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!gallery) {
            return res.status(404).send('Gallery information not found');
        }
        // Return response
        return res.status(200).json({message: 'User Gallery updated successfully', gallery })
    } catch (error) {
        console.log(error);
    }
};


// Function to get one gallery
export const getGallery = async (req, res) => {
    try {
        // Get skill by id
        const getGalleryById = await galleryModel.findById(req.params.id);
        // Return response
        return res.status(200).json(getGalleryById)
    } catch (error) {
        return res.status(200).json(error.message)
    }
}

// Function to get all gallery
export const getGallerys = async (req, res,next) => {
    try {
      // //we are fetching gallerys that belongs to a particular user
      const id = req.session?.user?.id || req?.user?.id
      const allGallery = await galleryModel.find({ user: id });
      return res.status(200).json({ Gallerys: allGallery });
    } catch (error) {
      // return res.status(500).json({error})
      next(error)
    }
  };
  

  export const deleteGallery = async (req, res, next) => {
    try {
     
  
      const id = req.session?.user?.id || req?.user?.id; 
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const gallery = await galleryModel.findByIdAndDelete(req.params.id);
        if (!gallery) {
            return res.status(404).send("Gallery not found");
        }
  
        user.gallery.pull(req.params.id);
        await user.save();

        return res.status(200).json({message: "Gallery deleted"});
    } catch (error) {
      // return res.status(500).json({error})
      next(error)
    }
  };
  
