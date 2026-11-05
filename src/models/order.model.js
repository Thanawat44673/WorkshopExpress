
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // ผู้สั่งซื้อ
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // เจ้าของร้าน
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // สินค้าที่สั่งซื้อ
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        // ชื่อสินค้าขณะสั่งซื้อ
        productName: {
            type: String,
            required: true,
            trim: true,
        },

        // ราคาต่อชิ้นขณะสั่งซื้อ
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // จำนวนสินค้าที่สั่งซื้อ
        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be an integer",
            },
        },

        // ราคารวม
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },

        // สถานะคำสั่งซื้อ
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

// Index สำหรับค้นหา Order ของผู้ซื้อและร้านค้า
orderSchema.index({ buyer: 1 });
orderSchema.index({ owner: 1 });
orderSchema.index({ product: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
