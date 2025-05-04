// backend/src/models/OrderItem.js

const { connect, sql } = require("../config/db");

class OrderItem {
  static table = "OrderItems";

  static async getByOrder(orderId) {
    // Ensure DB connection
    await connect();

    // Build request with parameter
    const req = new sql.Request();
    req.input("orderId", sql.Int, orderId);

    // Execute safe, parameterized query
    const { recordset } = await req.query(`
      SELECT ItemId, OrderId, ProductId, Quantity, PricePerUnit
      FROM ${this.table}
      WHERE OrderId = @orderId
    `);

    return recordset;
  }
}

module.exports = OrderItem;
