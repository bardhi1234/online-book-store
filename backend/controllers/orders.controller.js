const createOrder = async (req, res) => {
  const db = req.app.locals.db;
  const { items } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ message: "Order must have items" });
  }

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Totali i porosisë
    const total = items.reduce((acc, i) => acc + (i.price ?? 0) * (i.quantity ?? 0), 0);

    // Fut porosinë në tabelën orders
    const [result] = await db.execute(
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)",
      [userId, total, "pending"]
    );

    const orderId = result.insertId;

    // Fut artikujt në order_items
    for (const item of items) {
      if (!item.book_id) continue;

      await db.execute(
        "INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.book_id, item.quantity ?? 1, item.price ?? 0]
      );
    }

    res.status(201).json({ message: "Order submitted successfully", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const getOrders = async (req, res) => {
  const db = req.app.locals.db;

  try {
    let orderRows;

    if (req.user.role === "admin") {
      [orderRows] = await db.execute(
        "SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC"
      );
    } else {
      [orderRows] = await db.execute(
        "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
        [req.user.id]
      );
    }

    // marrim items për secilën porosi
    const orders = await Promise.all(
      orderRows.map(async (order) => {
        const [items] = await db.execute(
          `SELECT oi.book_id AS book_id, oi.quantity, oi.price, b.title
           FROM order_items oi
           JOIN books b ON oi.book_id = b.id
           WHERE oi.order_id = ?`,
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "shipped", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await db.execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Order status updated", status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Funksioni për fshirjen e porosisë (vetëm admin)
const deleteOrder = async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    // Fshi item-et e porosisë së parë
    await db.execute("DELETE FROM order_items WHERE order_id = ?", [id]);

    // Fshi porosinë
    const [result] = await db.execute("DELETE FROM orders WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, deleteOrder };
