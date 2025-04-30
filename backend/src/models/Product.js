const { sql } = require("../config/db");
class Product {
  static table = "Products";

  static async create({ name, description, price, category, isAvailable, imageUrl }) {
    await sql.query`
      INSERT INTO ${sql.raw(this.table)} (Name,Description,Price,Category,IsAvailable,ImageUrl)
      VALUES (${name},${description},${price},${category},${isAvailable},${imageUrl})
    `;
  }

  static async getAll() {
    const { recordset } = await sql.query`SELECT * FROM ${sql.raw(this.table)}`;
    return recordset;
  }

  static async getById(id) {
    const { recordset } = await sql.query`
      SELECT * FROM ${sql.raw(this.table)} WHERE ProductId = ${id}
    `;
    return recordset[0];
  }

  static async update(id, { name, description, price, category, isAvailable, imageUrl }) {
    await sql.query`
      UPDATE ${sql.raw(this.table)}
      SET Name=${name},Description=${description},Price=${price},Category=${category},IsAvailable=${isAvailable},ImageUrl=${imageUrl}
      WHERE ProductId=${id}
    `;
  }

  static async delete(id) {
    await sql.query`
      DELETE FROM ${sql.raw(this.table)} WHERE ProductId=${id}
    `;
  }
}

module.exports = Product;
