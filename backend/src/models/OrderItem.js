const { sql } = require("../config/db");
class OrderItem {
  static table = "OrderItems";

  static async getByOrder(orderId) {
    const { recordset } = await sql.query`
      SELECT * FROM ${sql.raw(this.table)} WHERE OrderId = ${orderId}
    `;
    return recordset;
  }
}

module.exports = OrderItem;
