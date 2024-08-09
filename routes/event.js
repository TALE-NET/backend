
import { createEvent, getEvents, getEvent, updateEvent, deleteEvent } from "../controllers/eventcontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";

import { Router } from "express";


export const eventRouter = Router()

eventRouter.post('/users/event', auth, hasPermission('create_event'), remoteUpload.fields([{ name: "image", maxCount: 1 }]), createEvent);

eventRouter.get('/users/event', getEvents);

eventRouter.get('/users/event/:id', getEvent);

eventRouter.patch('/users/event/:id',auth, hasPermission('update_event'), remoteUpload.fields([{ name: "image", maxCount: 1 }]),  updateEvent);

eventRouter.delete('/users/event/:id', auth,  hasPermission('delete_event'),deleteEvent);

