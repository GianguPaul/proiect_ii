const { sql } = require("../config/db");
class Order {
  static table = "Orders";

  static async create({ userId, deliveryAddress, items }) {
    // Compute total
    const total = items.reduce((sum, it) => sum + it.quantity * it.pricePerUnit, 0);
    const result = await sql.query`
      INSERT INTO ${sql.raw(this.table)} (UserId,DeliveryAddress,Status,TotalPrice,OrderDate)
      OUTPUT INSERTED.OrderId
      VALUES (${userId}, ${deliveryAddress}, 'pending', ${total}, GETDATE())
    `;
    const orderId = result.recordset[0].OrderId;
    // Insert items
    for (let it of items) {
      await sql.query`
        INSERT INTO OrderItems (OrderId,ProductId,Quantity,PricePerUnit)
        VALUES (${orderId},${it.productId},${it.quantity},${it.pricePerUnit})
      `;
    }
    return orderId;
  }

  static async getAll() {
    const { recordset } = await sql.query`SELECT * FROM ${sql.raw(this.table)}`;
    return recordset;
  }

  static async getById(id) {
    const { recordset } = await sql.query`
      SELECT * FROM ${sql.raw(this.table)} WHERE OrderId = ${id}
    `;
    return recordset[0];
  }

  static async getByUser(userId) {
    const { recordset } = await sql.query`
      SELECT * FROM ${sql.raw(this.table)} WHERE UserId = ${userId}
    `;
    return recordset;
  }

  static async updateStatus(id, status) {
    await sql.query`
      UPDATE ${sql.raw(this.table)} SET Status = ${status} WHERE OrderId = ${id}
    `;
  }

  static async delete(id) {
    await sql.query`
      DELETE FROM ${sql.raw(this.table)} WHERE OrderId = ${id}
    `;
  }
}

module.exports = Order;
