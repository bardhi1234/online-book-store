// routes/orders.routes.js
const express = require("express");
const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus
} = require("../controllers/orders.controller");

const { authMiddleware, isAdmin } = require("../middlewares/auth.middleware");

// Create order (user only)
router.post("/", authMiddleware, createOrder);

// Get orders (user gets only theirs, admin gets all)
router.get("/", authMiddleware, getOrders);

// Update order status (admin only)
router.put("/:id", authMiddleware, isAdmin, updateOrderStatus);

module.exports = router;
