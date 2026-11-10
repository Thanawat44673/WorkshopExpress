const Product = require("../models/product.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

// Get All Products
const getAllProducts = async (currentUser) => {
  try {
    // Owner เห็นสินค้าทุกสถานะของร้านเพื่อจัดการได้ ส่วนผู้ซื้อเห็นเฉพาะสินค้าพร้อมขาย
    const filter = currentUser?.role === "owner"
      ? { owner: currentUser.id }
      : currentUser?.role === "admin"
        ? {}
        : { isActive: true, stock: { $gt: 0 } };

    const products = await Product.find(filter)
      .populate("owner", "username")
      .sort({ createdAt: -1 });

    // 2. ส่งข้อมูลกลับ
    return products;

  } catch (error) {
    throw error;
  }
};

// Get Product By ID
const getProductById = async (productId, currentUser) => {
  try {
    // 1. ตรวจสอบรูปแบบ Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error("Product ID ไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    // 2. ค้นหาสินค้าจาก MongoDB
    const filter = { _id: productId };

    if (currentUser?.role === "owner") {
      filter.owner = currentUser.id;
    } else if (currentUser?.role !== "admin") {
      filter.isActive = true;
      filter.stock = { $gt: 0 };
    }

    const product = await Product.findOne(filter).populate("owner", "username");

    // 3. ตรวจสอบว่าพบสินค้าหรือไม่
    if (!product) {
      const error = new Error("ไม่พบสินค้าที่ต้องการ");
      error.statusCode = 404;
      throw error;
    }

    // 4. ส่งข้อมูลกลับ
    return product;

  } catch (error) {
    throw error;
  }
};

const createProduct = async ({
  name,
  description,
  price,
  stock,
  ownerId,
}) => {
  try {
    // 1. ตรวจสอบข้อมูลที่จำเป็น
    if (!name || price === undefined || price === null || price === "" ||
        stock === undefined || stock === null || stock === "") {
      const error = new Error("กรุณากรอกข้อมูลสินค้าให้ครบถ้วน");
      error.statusCode = 400;
      throw error;
    }

    // 2. ตรวจสอบชื่อสินค้า
    if (typeof name !== "string" || !name.trim()) {
      const error = new Error("ชื่อสินค้าไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    // 3. ตรวจสอบราคา
    const productPrice = Number(price);

    if (!Number.isFinite(productPrice) || productPrice < 0) {
      const error = new Error("ราคาสินค้าต้องเป็นตัวเลขและไม่ต่ำกว่า 0");
      error.statusCode = 400;
      throw error;
    }

    // 4. ตรวจสอบจำนวนสินค้า
    const productStock = Number(stock);

    if (!Number.isSafeInteger(productStock) || productStock < 0) {
      const error = new Error("จำนวนสินค้าต้องเป็นจำนวนเต็มและไม่ต่ำกว่า 0");
      error.statusCode = 400;
      throw error;
    }

    // 5. ตรวจสอบ Owner ID
    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      const error = new Error("Owner ID ไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    // 6. สร้างสินค้าใหม่
    const newProduct = await Product.create({
      name: name.trim(),
      description: description || "",
      price: productPrice,
      stock: productStock,
      owner: ownerId,
      isActive: productStock > 0,
    });

    // 7. ดึงข้อมูลเจ้าของสินค้า
    await newProduct.populate("owner", "username");

    // 8. ส่งข้อมูลกลับ
    return newProduct;

  } catch (error) {
    throw error;
  }
};


const updateProduct = async (productId, updateData, currentUser) => {
  try {
    //* 1. ตรวจสอบ Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error("Product ID ไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    //* 2. ค้นหาสินค้า
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("ไม่พบสินค้าที่ต้องการแก้ไข");
      error.statusCode = 404;
      throw error;
    }

    //* 3. ตรวจสอบสิทธิ์เจ้าของสินค้าและ Admin
    const isOwner =
      product.owner.toString() === currentUser.id.toString();

    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      const error = new Error("คุณไม่มีสิทธิ์แก้ไขสินค้านี้");
      error.statusCode = 403;
      throw error;
    }

    //* 4. กำหนด Field ที่อนุญาตให้แก้ไข
    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
    ];

    const fields = Object.keys(updateData);

    //* 5. ตรวจสอบว่ามี Field ที่อนุญาตหรือไม่
    const invalidFields = fields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      const error = new Error(
        `ไม่อนุญาตให้แก้ไขข้อมูล: ${invalidFields.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    if (fields.length === 0) {
      const error = new Error("กรุณาระบุข้อมูลที่ต้องการแก้ไข");
      error.statusCode = 400;
      throw error;
    }

    //* 6. ตรวจสอบชื่อสินค้า
    if (updateData.name !== undefined) {
      if (
        typeof updateData.name !== "string" ||
        !updateData.name.trim()
      ) {
        const error = new Error("ชื่อสินค้าไม่ถูกต้อง");
        error.statusCode = 400;
        throw error;
      }

      product.name = updateData.name.trim();
    }

    //* 7. ตรวจสอบรายละเอียดสินค้า
    if (updateData.description !== undefined) {
      if (typeof updateData.description !== "string") {
        const error = new Error("รายละเอียดสินค้าไม่ถูกต้อง");
        error.statusCode = 400;
        throw error;
      }

      product.description = updateData.description.trim();
    }

    //* 8. ตรวจสอบราคา
    if (updateData.price !== undefined) {
      const price = Number(updateData.price);

      if (!Number.isFinite(price) || price < 0) {
        const error = new Error("ราคาสินค้าไม่ถูกต้อง");
        error.statusCode = 400;
        throw error;
      }

      product.price = price;
    }

    //* 9. ตรวจสอบ Stock
    if (updateData.stock !== undefined) {
      const stock = Number(updateData.stock);

      if (!Number.isSafeInteger(stock) || stock < 0) {
        const error = new Error("จำนวนสินค้าไม่ถูกต้อง");
        error.statusCode = 400;
        throw error;
      }

      product.stock = stock;
      product.isActive = stock > 0;
    }

    const syncOrderSnapshot =
      product.isModified("name") || product.isModified("price");

    //* 10. บันทึกข้อมูล
    await product.save();

    if (syncOrderSnapshot) {
      const relatedOrders = await Order.find({ product: product._id })
        .select("_id quantity")
        .lean();

      if (relatedOrders.length > 0) {
        await Order.bulkWrite(
          relatedOrders.map((order) => ({
            updateOne: {
              filter: { _id: order._id },
              update: {
                $set: {
                  productName: product.name,
                  unitPrice: product.price,
                  totalPrice: product.price * order.quantity,
                },
              },
            },
          }))
        );
      }
    }

    //* 11. ดึงข้อมูลเจ้าของสินค้า
    await product.populate("owner", "username");

    return product;

  } catch (error) {
    throw error;
  }
};

const deleteProduct = async (productId, currentUser) => {
  try {
    // 1. ตรวจสอบ Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const error = new Error("Product ID ไม่ถูกต้อง");
      error.statusCode = 400;
      throw error;
    }

    // 2. ค้นหาสินค้า
    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("ไม่พบสินค้าที่ต้องการลบ");
      error.statusCode = 404;
      throw error;
    }

    // 3. ตรวจสอบสิทธิ์
    const isOwner =
      product.owner.toString() === currentUser.id.toString();

    const isAdmin = currentUser.role === "admin";

    if (!isOwner && !isAdmin) {
      const error = new Error("คุณไม่มีสิทธิ์ลบสินค้านี้");
      error.statusCode = 403;
      throw error;
    }

    // 4. ลบสินค้าออกจากฐานข้อมูลจริง
    await product.deleteOne();

    // 5. ส่งข้อมูลกลับ
    return {
      id: product._id,
      name: product.name,
    };

  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
