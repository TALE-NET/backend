
import { createProduct, getAllProduct, getOneProduct, updateProduct, deleteProduct } from "../controllers/productcontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";

import { Router } from "express";


export const productRouter = Router()

productRouter.post('/users/product', auth, hasPermission('create_product'), remoteUpload.fields([{ name: "image", maxCount: 1 }]), createProduct);

productRouter.get('/users/product', getAllProduct);

productRouter.get('/users/product/:id', getOneProduct);

productRouter.patch('/users/product/:id',auth, hasPermission('update_product'), remoteUpload.fields([{ name: "image", maxCount: 1 }]),  updateProduct);

productRouter.delete('/users/product/:id', auth,  hasPermission('delete_product'),deleteProduct);

