
import { createGallery, getGallerys, getGallery, updateGallery, deleteGallery } from "../controllers/gallerycontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";

import { Router } from "express";


export const galleryRouter = Router()

galleryRouter.post('/users/gallery', auth, hasPermission('create_gallery'), remoteUpload.fields([{ name: "image", maxCount: 9 }]), createGallery);

galleryRouter.get('/users/gallery', getGallerys);

galleryRouter.get('/users/gallery/:id', getGallery);

galleryRouter.patch('/users/gallery/:id',auth, hasPermission('update_gallery'), remoteUpload.fields([{ name: "image", maxCount: 1 }]),  updateGallery);

galleryRouter.delete('/users/gallery/:id', auth,  hasPermission('delete_gallery'),deleteGallery);

