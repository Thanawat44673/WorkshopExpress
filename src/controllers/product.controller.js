const productService = require("../services/product.service");
const {
  replaceProductImage,
  removeProductImages,
} = require("../services/product-image.service");

const serializeProduct = (product) => {
  const result = product.toObject();
  delete result.image;
  return result;
};

// GET All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      status: 200,
      message: "Product list retrieved successfully",
      data: {
        products: products.map(serializeProduct),
      }
    });

  } catch (error) {
    // console.error("Get All Products Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

// GET Product By ID
const getProductById = async (req, res) => {
  try {
    // รับ Product ID จาก URL Parameters
    const { id } = req.params;

    const product = await productService.getProductById(id);

    return res.status(200).json({
      status: 200,
      message: "Product list retrieved successfully",
      data: {
        product: serializeProduct(product),
      }
    });

  } catch (error) {
    // console.error("Get Product By ID Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

// CREATE Product
//* CREATE Product*
const createProduct = async (req, res) => {
  try {
    //* รับข้อมูลจาก Request Body
    const { name, description, price, stock } = req.body;

    //* ใช้ ID จาก JWT ไม่รับ owner จาก Client
    const ownerId = req.user.id;

    const product = await productService.createProduct({
      name,
      description,
      price,
      stock,
      ownerId,
    });

    await replaceProductImage(product._id, req.file?.path);

    return res.status(201).json({
      status: 201,
      message: "Product added successfully",
      data: {
        product: serializeProduct(product),
      }
    });

  } catch (error) {
    // console.error("Create Product Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

// UPDATE Product
const updateProduct = async (req, res) => {
  try {
    // รับ Product ID จาก URL
    const { id } = req.params;

    // รับข้อมูลที่ต้องการแก้ไข
    const updateData = req.body;

    // ข้อมูลผู้ใช้งานจาก JWT
    const currentUser = {
      id: req.user.id,
      role: req.user.role,
    };

    const product = await productService.updateProduct(
      id,
      updateData,
      currentUser
    );

    await replaceProductImage(product._id, req.file?.path);

    return res.status(200).json({
      status: 200,
      message: "Product edit successfully",
      data: {
        product: serializeProduct(product),
      }
    });

  } catch (error) {
    // console.error("Update Product Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

// DELETE Product
const deleteProduct = async (req, res) => {
  try {
    // รับ Product ID จาก URL
    const { id } = req.params;

    // ข้อมูลผู้ใช้งานจาก JWT
    const currentUser = {
      id: req.user.id,
      role: req.user.role,
    };

    const product = await productService.deleteProduct(
      id,
      currentUser
    );

    try {
      await removeProductImages(product.id);
    } catch (error) {
      console.error("Product image cleanup failed:", error);
    }

    return res.status(200).json({
      status: 200,
      message: "Product delete successfully",
      data: {
        product,
      }
    });

  } catch (error) {
    // console.error("Delete Product Error:", error);

    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      message: error.message || "Internal server error", 
      data: {}
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
