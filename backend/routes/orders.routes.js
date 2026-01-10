const express = require("express");
const router = express.Router();

const { createOrder, getOrders, updateOrderStatus, deleteOrder } = require("../controllers/orders.controller");
const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// CREATE ORDER (user)
router.post("/", authMiddleware, createOrder);

// GET ORDERS (user = vetëm të tyre, admin = të gjitha)
router.get("/", authMiddleware, getOrders);

// UPDATE STATUS (admin only)
router.put("/:id", authMiddleware, isAdmin, updateOrderStatus);

// DELETE ORDER (admin only)
router.delete("/:id", authMiddleware, isAdmin, deleteOrder);

module.exports = router;
