import { eventSchema } from "../schema/event.js";
import { userModel } from "../models/usermodel.js";
import { eventModel } from "../models/eventmodel.js";

export const createEvent = async (req, res, next) => {
    try {
      const { error, value } = eventSchema.validate({  
        ...req.body,
        image: req.files?.image[0].fileName,
      });
  
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const id = req.session?.user?.id || req?.user?.id;
     
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const event = await eventModel.create({
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
export const updateEvent = async (req, res) => {
    try {
        const updateFields = { ...req.body };

        if (req.file.filename) {
            updateFields.image = req.file.filename;
        } else if (req.files?.image) {
            updateFields.image = req.file.filename;
        }

        // Validate data provided by user
        const { error, value } = eventSchema.validate({updateFields});
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // Retrieve user session
        const userId = req.session?.user?.id || req?.user?.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('User Event not found');
        }
        // Update event by id
        const event = await eventModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!event) {
            return res.status(404).send('Event not found');
        }
        // Return response
        return res.status(200).json({message: 'User Event updated successfully', event })
    } catch (error) {
        console.log(error);
    }
};


// Function to get one event
export const getEvent = async (req, res) => {
    try {
        // Get skill by id
        const getEventById = await eventModel.findById(req.params.id);
        // Return response
        return res.status(200).json(getEventById)
    } catch (error) {
        return res.status(200).json(error.message)
    }
}

// Function to get all events
export const getEvents = async (req, res,next) => {
    try {
      // //we are fetching events that belongs to a particular user
      const id = req.session?.user?.id || req?.user?.id
      const allEvent = await eventModel.find({ user: id });
      return res.status(200).json({ Events: allEvent });
    } catch (error) {
      // return res.status(500).json({error})
      next(error)
    }
  };
  

  export const deleteEvent = async (req, res, next) => {
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
  
