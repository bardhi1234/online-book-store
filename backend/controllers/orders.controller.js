// controllers/orders.controller.js

// CREATE ORDER
const createOrder = async (req, res) => {
  const db = req.app.locals.db;
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "Order must have items" });
  }

  try {
    const userId = req.user.id;
    let total = 0;

    // Kontrollo stock dhe përllogarit totalin
    for (const item of items) {
      const [rows] = await db.execute("SELECT price, stock, title FROM books WHERE id = ?", [item.book_id]);
      const book = rows[0];
      if (!book) return res.status(404).json({ message: `Book ${item.book_id} not found` });
      if (item.quantity > book.stock) {
        return res.status(400).json({ message: `Not enough stock for book ${book.title}. Available: ${book.stock}` });
      }
      total += book.price * item.quantity;
    }

    // Fut porosinë në tabelën orders
    const [orderResult] = await db.execute(
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)",
      [userId, total, "pending"]
    );
    const orderId = orderResult.insertId;

    // Fut item-et dhe redukto stock
    for (const item of items) {
      const [rows] = await db.execute("SELECT price, stock FROM books WHERE id = ?", [item.book_id]);
      const book = rows[0];

      await db.execute(
        "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.book_id, item.quantity, book.price]
      );

      const newStock = book.stock - item.quantity;
      await db.execute("UPDATE books SET stock = ? WHERE id = ?", [newStock, item.book_id]);
    }

    res.status(201).json({ message: "Order submitted successfully", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// GET ORDERS
const getOrders = async (req, res) => {
  const db = req.app.locals.db;
  const userId = req.user.id;
  const isAdmin = req.user.role === "admin";

  try {
    let rows;
    if (isAdmin) {
      [rows] = await db.execute("SELECT * FROM orders ORDER BY created_at DESC");
    } else {
      [rows] = await db.execute("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC", [userId]);
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ORDER STATUS (admin only)
const updateOrderStatus = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "paid", "shipped", "cancelled"];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });

  try {
    const [result] = await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE ORDER (admin only)
const deleteOrder = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM orders WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};
