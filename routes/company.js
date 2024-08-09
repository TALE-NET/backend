
import { createCompany, getCompanys, getCompany, updateCompany, deleteCompany } from "../controllers/companycontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";

import { Router } from "express";


export const companyRouter = Router()

companyRouter.post('/users/company', auth, hasPermission('create_company'), remoteUpload.fields([{ name: "image", maxCount: 1 }]), createCompany);

companyRouter.get('/users/company', getCompanys);

companyRouter.get('/users/company/:id', getCompany);

companyRouter.patch('/users/company/:id',auth, hasPermission('update_company'), remoteUpload.fields([{ name: "image", maxCount: 1 }]),  updateCompany);

companyRouter.delete('/users/company/:id', auth,  hasPermission('delete_company'),deleteCompany);

