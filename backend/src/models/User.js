const { sql } = require("../config/db");
const bcrypt = require("bcryptjs");
class User {
  static table = "Users";

  static async create({ name, email, password, role, phone, address }) {
    const hashed = await bcrypt.hash(password, 10);
    await sql.query`
      INSERT INTO ${sql.raw(this.table)} (Name,Email,Password,Role,Phone,Address)
      VALUES (${name},${email},${hashed},${role},${phone},${address})
    `;
  }

  static async findByEmail(email) {
    const { recordset } = await sql.query`
      SELECT * FROM ${sql.raw(this.table)} WHERE Email = ${email}
    `;
    return recordset[0];
  }

  static async getAll() {
    const { recordset } = await sql.query`SELECT UserId,Name,Email,Role,Phone,Address FROM ${sql.raw(this.table)}`;
    return recordset;
  }

  static async getById(id) {
    const { recordset } = await sql.query`
      SELECT UserId,Name,Email,Role,Phone,Address FROM ${sql.raw(this.table)} WHERE UserId = ${id}
    `;
    return recordset[0];
  }

  static async update(id, { name, email, role, phone, address }) {
    await sql.query`
      UPDATE ${sql.raw(this.table)}
      SET Name=${name}, Email=${email}, Role=${role}, Phone=${phone}, Address=${address}
      WHERE UserId=${id}
    `;
  }

  static async delete(id) {
    await sql.query`
      DELETE FROM ${sql.raw(this.table)} WHERE UserId=${id}
    `;
  }
}

module.exports = User;
