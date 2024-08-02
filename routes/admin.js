
import { createUser, updateUser } from "../controllers/admin.js";
// import { createProduct, getAllProduct, getOneProduct, updateProduct, deleteProduct } from "../controllers/productcontroller.js";
import { auth, hasPermission } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/upload.js";
import { Router } from "express";


export const adminRouter = Router()

adminRouter.post('/admin/user/product', auth, hasPermission('create_product'), remoteUpload.single('image'), createUser);

// adminRouter.get('/user/product', getAllProduct);

// adminRouter.get('/user/product/:id', getOneProduct);

adminRouter.patch('/admin/user/product/:id',auth, hasPermission('update_user'), remoteUpload.single('image'),  updateUser);

// adminRouter.delete('/user/product/:id', auth,  hasPermission('delete_product'),deleteProduct);

export default adminRouter;