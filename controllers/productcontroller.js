
import { productSchema } from "../schema/products.js";
import { userModel } from "../models/usermodel.js";
import { productModel } from "../models/productmodel.js";

export const createProduct = async (req, res) => {
  try {
    const { error, value } = productSchema.validate({  
      ...req.body,
      image: req.file.filename
    });

    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const id = req.session?.user?.id || req?.user?.id;
   
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    const product = await productModel.create({
        ...value, 
        createdBy: id
     });
// The products here is being referenced from the UserModel object created {products} there
    user.products.push(product._id)

    await user.save();

    return res.status(201).json({message: 'Product created successfully', product });
  } catch (error) {
    console.log(error)

  }
};


// Function to get all products
export const getAllProduct = async (req, res) => {
  try {
    // //we are fetching Products that belongs to a particular user
    const id = req.session?.user?.id || req?.user?.id
    const allProduct = await productModel.find({ user: id });
    return res.status(200).json({ Products: allProduct });
  } catch (error) {
    return res.status(500).json({error})
  }
// try {
//     const { populate } = req.query;
//     // Find articles
//     const defaultPopulate = { path: "createdBy", select: { "name": true } }
//     const products = await productModel
//         .find()
//         .populate(populate ? JSON.parse(populate) : defaultPopulate);
//     // Return response
//     res.status(200).json(products);
// } catch (error) {
//     next(error);
// }
};



// Function to get one product for a particular user
export const getOneProduct = async (req, res) => {
  try {
      // Get product by id
      const getProductById = await productModel.findById(req.params.id);
      // Return response
      return res.status(200).json(getProductById)
  } catch (error) {
      return res.status(200).json(error.message)
  }
}


// Function to update an product
export const updateProduct = async (req, res) => {
    try {
      const { error, value } = productSchema.validate({  
        ...req.body,
        image: req.file.filename,});

  
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
  
      const id = req.session?.user?.id || req?.user?.id; 
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const product = await productModel.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!product) {
            return res.status(404).send("Prodcuct not found");
        }
  
        return res.status(200).json({ message: 'Product information updated successfully', product });
    } catch (error) {
      return res.status(500).json({error})
    }
  };


  export const deleteProduct = async (req, res) => {
    try {
     
  
      const id = req.session?.user?.id || req?.user?.id; 
      const user = await userModel.findById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const product = await productModel.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).send("Product not found");
        }
  
        user.product.pull(req.params.id);
        await user.save();

        return res.status(200).json({message: "Product deleted"});
    } catch (error) {
      return res.status(500).json({error})
    }
  };
  
