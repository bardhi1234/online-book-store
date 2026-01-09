// controllers/orders.controller.js

// CREATE ORDER
exports.createOrder = async (req, res) => {
  const db = req.app.locals.db;
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "Order must have items" });
  }

  for (let item of items) {
    if (!item.bookId || !item.quantity || !item.price) {
      return res.status(400).json({ message: "Each item must have bookId, quantity, and price" });
    }
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const [orderResult] = await db.execute(
      "INSERT INTO orders (user_id, total) VALUES (?, ?)",
      [req.user.id, total]
    );

    const orderId = orderResult.insertId;

    for (let item of items) {
      await db.execute(
        "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.bookId, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: "Order created", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET ORDERS (user & admin)
exports.getOrders = async (req, res) => {
  const db = req.app.locals.db;

  try {
    let orders;

    if (req.user.role === "admin") {
      const [orderRows] = await db.execute("SELECT * FROM orders");
      orders = await Promise.all(orderRows.map(async order => {
        const [items] = await db.execute(
          "SELECT * FROM order_items WHERE order_id = ?",
          [order.id]
        );
        return { ...order, items };
      }));
    } else {
      const [orderRows] = await db.execute(
        "SELECT * FROM orders WHERE user_id = ?",
        [req.user.id]
      );
      orders = await Promise.all(orderRows.map(async order => {
        const [items] = await db.execute(
          "SELECT * FROM order_items WHERE order_id = ?",
          [order.id]
        );
        return { ...order, items };
      }));
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER STATUS (admin only)
exports.updateOrderStatus = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending","paid","shipped","cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await db.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );
    res.json({ message: `Order ${id} status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
