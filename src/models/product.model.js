const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        // ชื่อสินค้า
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // รายละเอียดสินค้า
        description: {
            type: String,
            trim: true,
            default: "",
        },

        // ราคาสินค้า
        price: {
            type: Number,
            required: true,
            min: 0,
        },

        //* จำนวนสินค้าในคลัง
        stock: {
            type: Number,
            required: true,
            min: 0,
            validate: {
                validator: Number.isSafeInteger,
                message: "Stock must be a safe integer",
            },
        },

        // เจ้าของสินค้า
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // สถานะสินค้า
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index สำหรับค้นหาสินค้าของแต่ละร้าน
productSchema.index({ owner: 1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
