// backend/src/models/User.js

const { connect, sql } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static table = 'Users';

  static async create({ name, email, password, role, phone, address }) {
    await connect();
    const hashed = await bcrypt.hash(password, 10);
    const req = new sql.Request();
    req.input('name',     sql.NVarChar, name)
       .input('email',    sql.NVarChar, email)
       .input('password', sql.NVarChar, hashed)
       .input('role',     sql.NVarChar, role)
       .input('phone',    sql.NVarChar, phone)
       .input('address',  sql.NVarChar, address);
    await req.query(`
      INSERT INTO ${this.table}
        (Name, Email, Password, Role, Phone, Address)
      VALUES
        (@name, @email, @password, @role, @phone, @address)
    `);
  }

  static async findByEmail(email) {
    await connect();
    const req = new sql.Request();
    req.input('email', sql.NVarChar, email);
    const { recordset } = await req.query(`
      SELECT *
      FROM ${this.table}
      WHERE Email = @email
    `);
    return recordset[0];
  }

  static async getAll() {
    await connect();
    const req = new sql.Request();
    const { recordset } = await req.query(`
      SELECT UserId, Name, Email, Role, Phone, Address
      FROM ${this.table}
    `);
    return recordset;
  }

  static async getById(id) {
    await connect();
    const req = new sql.Request();
    req.input('id', sql.Int, id);
    const { recordset } = await req.query(`
      SELECT UserId, Name, Email, Role, Phone, Address
      FROM ${this.table}
      WHERE UserId = @id
    `);
    return recordset[0];
  }

  static async update(id, { name, email, role, phone, address }) {
    await connect();
    const req = new sql.Request();
    req.input('id',      sql.Int,     id)
       .input('name',    sql.NVarChar, name)
       .input('email',   sql.NVarChar, email)
       .input('role',    sql.NVarChar, role)
       .input('phone',   sql.NVarChar, phone)
       .input('address', sql.NVarChar, address);
    await req.query(`
      UPDATE ${this.table}
      SET
        Name    = @name,
        Email   = @email,
        Role    = @role,
        Phone   = @phone,
        Address = @address
      WHERE UserId = @id
    `);
  }

  static async delete(id) {
    await connect();
    const req = new sql.Request();
    req.input('id', sql.Int, id);
    await req.query(`
      DELETE FROM ${this.table}
      WHERE UserId = @id
    `);
  }
}

module.exports = User;
