// controllers/orders.controller.js
const orders = []; // Për shembull, do përdorim një array thjesht për testim
let orderId = 1;

// CREATE ORDER (User)
exports.createOrder = (req, res) => {
  const { items } = req.body; // array me librat që po porositet
  if (!items || !items.length) {
    return res.status(400).json({ message: "Order must have at least one item" });
  }

  const newOrder = {
    id: orderId++,
    userId: req.user.id, // supozojmë që authMiddleware ka shtuar user në req
    items,
    status: "pending",
    createdAt: new Date()
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
};

// GET ORDERS (User: vetëm të vetat, Admin: të gjitha)
exports.getOrders = (req, res) => {
  if (req.user.role === "admin") {
    return res.json(orders);
  }
  const userOrders = orders.filter(order => order.userId === req.user.id);
  res.json(userOrders);
};

// UPDATE ORDER STATUS (Admin)
exports.updateOrderStatus = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find(o => o.id == id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.status = status;
  res.json(order);
};
