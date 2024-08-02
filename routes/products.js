
import { createProduct, getAllProduct, getOneProduct, updateProduct, deleteProduct } from "../controllers/productcontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";

import { Router } from "express";


export const productRouter = Router()

productRouter.post('/user/product', auth, hasPermission('create_product'), remoteUpload.single('image'), createProduct);

productRouter.get('/user/product', getAllProduct);

productRouter.get('/user/product/:id', getOneProduct);

productRouter.patch('/user/product/:id',auth, hasPermission('update_product'), remoteUpload.single('image'),  updateProduct);

productRouter.delete('/user/product/:id', auth,  hasPermission('delete_product'),deleteProduct);

