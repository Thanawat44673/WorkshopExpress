const mongoose = require("mongoose");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

// * ดึงรายการ Order ของสินค้า
const getProductOrders = async (productId, currentUser) => {
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
            const error = new Error("ไม่พบสินค้าที่ต้องการ");
            error.statusCode = 404;
            throw error;
        }

        //* 3. ตรวจสอบสิทธิ์เจ้าของสินค้าและ Admin
        const isOwner =
            product.owner.toString() === currentUser.id.toString();

        const isAdmin = currentUser.role === "admin";

        if (!isOwner && !isAdmin) {
            const error = new Error("คุณไม่มีสิทธิ์ดูรายการสั่งซื้อสินค้านี้");
            error.statusCode = 403;
            throw error;
        }

        //* 4. ค้นหา Order ของสินค้านี้
        const orders = await Order.find({
            product: productId,
        })
            .populate("buyer", "username")
            .sort({ createdAt: -1 });

        //* 5. ส่งข้อมูล Order กลับ
        return orders;

    } catch (error) {
        throw error;
    }
};

// * ดึงรายการ Order ทั้งหมดตามสิทธิ์ผู้ใช้งาน
const getAllOrders = async (currentUser) => {
    try {
        //* 1. กำหนดเงื่อนไขการค้นหา Order
        let filter = {};

        //* 2. ตรวจสอบสิทธิ์ Admin
        if (currentUser.role === "admin") {
            // Admin สามารถดู Order ทั้งหมดได้
            filter = {};
        } else {
            //* 3. User และ Owner ดูเฉพาะ Order ที่เกี่ยวข้องกับตัวเอง
            filter = {
                $or: [
                    { buyer: currentUser.id },
                    { owner: currentUser.id },
                ],
            };
        }

        //* 4. ค้นหา Order ตามเงื่อนไข
        const orders = await Order.find(filter)
            .populate("buyer", "username")
            .populate("owner", "username")
            .populate("product", "name")
            .sort({ createdAt: -1 });

        //* 5. ส่งข้อมูล Order กลับ
        return orders;

    } catch (error) {
        throw error;
    }
};

//* สร้างคำสั่งซื้อสินค้า
const createOrder = async (productId, quantity, buyerId) => {
    try {
        //* 1. ตรวจสอบ Product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            const error = new Error("Product ID ไม่ถูกต้อง");
            error.statusCode = 400;
            throw error;
        }

        //* 2. ตรวจสอบจำนวนสินค้าที่ต้องการซื้อ
        const orderQuantity = Number(quantity);

        if (
            !Number.isSafeInteger(orderQuantity) ||
            orderQuantity < 1
        ) {
            const error = new Error("จำนวนสินค้าที่สั่งซื้อไม่ถูกต้อง");
            error.statusCode = 400;
            throw error;
        }

        //* 3. ค้นหาสินค้า
        const product = await Product.findOne({
            _id: productId,
            isActive: true,
        });

        if (!product) {
            const error = new Error("ไม่พบสินค้าที่ต้องการสั่งซื้อ");
            error.statusCode = 404;
            throw error;
        }

        //* 4. ตรวจสอบว่าไม่ได้สั่งซื้อสินค้าของตัวเอง
        if (product.owner.toString() === buyerId.toString()) {
            const error = new Error("ไม่สามารถสั่งซื้อสินค้าของตัวเองได้");
            error.statusCode = 403;
            throw error;
        }

        //* 5. ตรวจสอบและลด Stock อย่างปลอดภัย
        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: productId,
                isActive: true,
                stock: { $gte: orderQuantity },
            },
            {
                $inc: { stock: -orderQuantity },
            },
            {
                new: true,
            }
        );

        if (!updatedProduct) {
            const error = new Error("สินค้าไม่เพียงพอสำหรับการสั่งซื้อ");
            error.statusCode = 409;
            throw error;
        }

        //* 6. คำนวณราคารวมจากราคาสินค้าใน Database
        const totalPrice = product.price * orderQuantity;

        //* 7. สร้าง Order
        try {
            const order = await Order.create({
                buyer: buyerId,
                owner: product.owner,
                product: product._id,
                productName: product.name,
                unitPrice: product.price,
                quantity: orderQuantity,
                totalPrice,
            });

            return order;

        } catch (error) {
            //* หากสร้าง Order ไม่สำเร็จ ให้คืน Stock กลับ
            await Product.updateOne(
                { _id: productId },
                { $inc: { stock: orderQuantity } }
            );

            throw error;
        }

    } catch (error) {
        throw error;
    }
};

module.exports = {
    createOrder,
    getProductOrders,
    getAllOrders
};
