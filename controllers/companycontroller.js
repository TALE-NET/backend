import { companySchema } from "../schema/company.js";
import { userModel } from "../models/usermodel.js";
import { companyModel } from "../models/companymodel.js";

export const createCompany = async (req, res, next) => {
    try {
      const { error, value } = companySchema.validate({  
        ...req.body,
        image: req.files?.image[0].fileName,
      });
  
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const id = req.session?.user?.id || req?.user?.id;
     
      const user = await companyModel.findById(id);
      if (!user) {
        return res.status(404).send("Event not found");
      }
  
      const event = await companyModel.create({
          ...value, 
          user: id
       });
  // The products here is being referenced from the UserModel object created {products} there
      user.products.push(event._id)
  
      await user.save();
  
      return res.status(201).json({message: 'Event created successfully', event });
    } catch (error) {
      // console.log(error)
  next(error)
    }
  };
  

  // Function to update a event
export const updateCompany = async (req, res) => {
    try {
        const updateFields = { ...req.body };

        if (req.file.filename) {
            updateFields.image = req.file.filename;
        } else if (req.files?.image) {
            updateFields.image = req.file.filename;
        }

        // Validate data provided by user
        const { error, value } = companySchema.validate({updateFields});
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Retrieve user session
        const userId = req.session?.user?.id || req?.user?.id;
        const user = await companyModel.findById(userId);
        if (!user) {
            return res.status(404).send('User Not Found');
        }
        // Update event by id
        const company = await companyModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!company) {
            return res.status(404).send('Company Not Found');
        }
        // Return response
        return res.status(200).json({message: 'Company Information Updated Successfully', company })
    } catch (error) {
        console.log(error);
    }
};


// Function to get one event
export const getCompany = async (req, res) => {
    try {
        // Get skill by id
        const getCompById = await companyModel.findById(req.params.id);
        // Return response
        return res.status(200).json(getCompById)
    } catch (error) {
        return res.status(200).json(error.message)
    }
}

// Function to get all events
export const getCompanys = async (req, res,next) => {
    try {
      // //we are fetching events that belongs to a particular user
      const id = req.session?.user?.id || req?.user?.id
      const allComp = await companyModel.find({ user: id });
      return res.status(200).json({ Company: allComp });
    } catch (error) {
      // return res.status(500).json({error})
      next(error)
    }
  };
  

  export const deleteCompany = async (req, res, next) => {
    try {
     
  
      const id = req.session?.user?.id || req?.user?.id; 
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User Not Found");
      }
  
      const comp = await companyModel.findByIdAndDelete(req.params.id);
        if (!comp) {
            return res.status(404).send("Company Information Not Found");
        }
  
        user.comp.pull(req.params.id);
        await user.save();

        return res.status(200).json({message: "Company Information Deleted"});
    } catch (error) {
      // return res.status(500).json({error})
      next(error)
    }
  };
  
