const orderService = require("../services/order.service");

// * ดึงรายการ Order ของสินค้า
const getProductOrders = async (req, res) => {
    try {
        //* 1. รับ Product ID จาก URL
        const { id } = req.params;

        //* 2. รับข้อมูลผู้ใช้งานปัจจุบันจาก Token
        const currentUser = {
            id: req.user.id,
            role: req.user.role,
        };

        //* 3. ส่งข้อมูลไปให้ Service
        const order = await orderService.getProductOrders(
            id,
            currentUser
        );

        if (order.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "No orders found for this product",
                data: []
            });
        }

        //* 4. ส่ง Response กลับไปยัง Client
        return res.status(200).json({
            status: 200,
            message: "Get order successfully",
            data: order
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error", 
            data: {}
        });
    }
};

//* สร้างคำสั่งซื้อสินค้า
const createOrder = async (req, res) => {
    try {
        //* 1. รับ Product ID จาก URL
        const { id } = req.params;

        //* 2. รับจำนวนสินค้าที่ต้องการซื้อ
        const { quantity } = req.body;

        //* 3. รับ ID ผู้ซื้อจาก Token
        const buyerId = req.user.id;

        //* 4. ส่งข้อมูลไปให้ Service ประมวลผล
        const order = await orderService.createOrder(
            id,
            quantity,
            buyerId
        );

        //* 5. ส่ง Response กลับไปยัง Client
        return res.status(201).json({
            status: 201,
            message: "Create order successfully",
            data: order
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error", 
            data: {}
        });
    }
};

// ดูรายการ Order ทั้งหมดของผู้ใช้งาน
const getAllOrders = async (req, res) => {
  try {
    // ดึงข้อมูลผู้ใช้งานจาก Token
    const currentUser = {
      id: req.user.id,
      role: req.user.role,
    };

    // เรียกใช้งาน Service
    const orders = await orderService.getAllOrders(currentUser);

    if (orders.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No orders found",
        data: []
      });
    }

    return res.status(200).json({
            status: 200,
            message: "Get all orders successfully",
            data: orders
    });

  } catch (error) {
        return res.status(error.statusCode || 500).json({
            status: error.statusCode || 500,
            message: error.message || "Internal server error", 
            data: {}
        });
  }
};

module.exports = {
    createOrder,
    getProductOrders,
    getAllOrders
};
