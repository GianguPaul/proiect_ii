// backend/src/models/Order.js

const { connect, sql } = require("../config/db");

class Order {
  static table = "Orders";

  static async create({ userId, deliveryAddress, items }) {
    await connect();

    // Compute total
    const total = items.reduce((sum, it) => sum + it.quantity * it.pricePerUnit, 0);
    console.log("→ Creating order:", { userId, deliveryAddress, total, items });

    // Insert order and get its new ID
    const reqOrder = new sql.Request();
    reqOrder
      .input("userId", sql.Int, userId)
      .input("deliveryAddress", sql.NVarChar, deliveryAddress)
      .input("status", sql.NVarChar, "pending")
      .input("total", sql.Decimal(10, 2), total);

    const result = await reqOrder.query(`
      INSERT INTO ${this.table} (UserId, DeliveryAddress, Status, TotalPrice)
      OUTPUT INSERTED.OrderId
      VALUES (@userId, @deliveryAddress, @status, @total)
    `);
    const orderId = result.recordset[0].OrderId;
    console.log("→ New OrderId =", orderId);

    // Insert each OrderItem
    for (let it of items) {
      const reqItem = new sql.Request();
      reqItem
        .input("orderId", sql.Int, orderId)
        .input("productId", sql.Int, it.productId)
        .input("quantity", sql.Int, it.quantity)
        .input("pricePerUnit", sql.Decimal(10, 2), it.pricePerUnit);

      console.log(`   ↳ Inserting Item:`, { orderId, productId: it.productId, quantity: it.quantity, pricePerUnit: it.pricePerUnit });
      await reqItem.query(`
        INSERT INTO OrderItems (OrderId, ProductId, Quantity, PricePerUnit)
        VALUES (@orderId, @productId, @quantity, @pricePerUnit)
      `);
    }

    return orderId;
  }

  static async getAll() {
    await connect();
    const req = new sql.Request();
    const { recordset } = await req.query(
      `SELECT OrderId, UserId, OrderDate, Status, TotalPrice, DeliveryAddress FROM ${this.table}`
    );
    return recordset;
  }

  static async getByUser(userId) {
    await connect();
    const req = new sql.Request();
    req.input("userId", sql.Int, userId);
    const { recordset } = await req.query(
      `SELECT OrderId, UserId, OrderDate, Status, TotalPrice, DeliveryAddress
       FROM ${this.table}
       WHERE UserId = @userId`
    );
    return recordset;
  }

  static async updateStatus(id, status) {
    await connect();
    const req = new sql.Request();
    req.input("id", sql.Int, id).input("status", sql.NVarChar, status);
    await req.query(
      `UPDATE ${this.table}
       SET Status = @status
       WHERE OrderId = @id`
    );
  }

  static async delete(id) {
    await connect();
    // First delete all related OrderItems
    const reqItems = new sql.Request();
    reqItems.input("orderId", sql.Int, id);
    await reqItems.query(
      `DELETE FROM OrderItems WHERE OrderId = @orderId`
    );
    // Then delete the Order itself
    const reqOrder = new sql.Request();
    reqOrder.input("id", sql.Int, id);
    await reqOrder.query(
      `DELETE FROM ${this.table} WHERE OrderId = @id`
    );
  }
}

module.exports = Order;
