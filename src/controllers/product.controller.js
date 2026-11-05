
const productService = require("../services/product.service");

// GET All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      message: "ดึงรายการสินค้าสำเร็จ",
      data: products,
    });

  } catch (error) {
    console.error("Get All Products Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสินค้า",
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
      success: true,
      message: "ดึงรายละเอียดสินค้าสำเร็จ",
      data: product,
    });

  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการดึงสินค้า",
    });
  }
};

// CREATE Product
//* CREATE Product*
const createProduct = async (req, res) => {
  try {
    //* รับข้อมูลจาก Request Body
    const { name, description, price, stock } = req.body;

    //* รับไฟล์รูปภาพจาก Multer
    const image = req.file ? req.file.path : null;

    //* ใช้ ID จาก JWT ไม่รับ owner จาก Client
    const ownerId = req.user.id;

    const product = await productService.createProduct({
      name,
      description,
      price,
      stock,
      image,
      ownerId,
    });

    return res.status(201).json({
      success: true,
      message: "เพิ่มสินค้าสำเร็จ",
      data: product,
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า",
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

    return res.status(200).json({
      success: true,
      message: "แก้ไขสินค้าสำเร็จ",
      data: product,
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการแก้ไขสินค้า",
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

    return res.status(200).json({
      success: true,
      message: "ลบสินค้าสำเร็จ",
      data: product,
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการลบสินค้า",
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