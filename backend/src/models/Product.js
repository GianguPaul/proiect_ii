// backend/src/models/Product.js

const { connect, sql } = require('../config/db');

class Product {
  static table = 'Products';

  static async getAll() {
    await connect();
    const req = new sql.Request();
    const { recordset } = await req.query(`
      SELECT ProductId, Name, Description, Price, Category, IsAvailable, ImageUrl
      FROM ${this.table}
    `);
    return recordset;
  }

  static async getById(id) {
    await connect();
    const req = new sql.Request();
    req.input('id', sql.Int, id);
    const { recordset } = await req.query(`
      SELECT ProductId, Name, Description, Price, Category, IsAvailable, ImageUrl
      FROM ${this.table}
      WHERE ProductId = @id
    `);
    return recordset[0];
  }

  static async create({ Name, Description, Price, Category, IsAvailable, ImageUrl }) {
    await connect();
    const req = new sql.Request();
    req
      .input('name',         sql.NVarChar, Name)
      .input('description',  sql.NVarChar, Description)
      .input('price',        sql.Decimal(18,2), Price)
      .input('category',     sql.NVarChar, Category)
      .input('isAvailable',  sql.Bit, IsAvailable)
      .input('imageUrl',     sql.NVarChar, ImageUrl);
    await req.query(`
      INSERT INTO ${this.table}
        (Name, Description, Price, Category, IsAvailable, ImageUrl)
      VALUES
        (@name, @description, @price, @category, @isAvailable, @imageUrl)
    `);
  }

  static async update(id, { Name, Description, Price, Category, IsAvailable, ImageUrl }) {
    await connect();
    const req = new sql.Request();
    req
      .input('id',           sql.Int,        id)
      .input('name',         sql.NVarChar,   Name)
      .input('description',  sql.NVarChar,   Description)
      .input('price',        sql.Decimal(18,2), Price)
      .input('category',     sql.NVarChar,   Category)
      .input('isAvailable',  sql.Bit,        IsAvailable)
      .input('imageUrl',     sql.NVarChar,   ImageUrl);
    await req.query(`
      UPDATE ${this.table}
      SET
        Name        = @name,
        Description = @description,
        Price       = @price,
        Category    = @category,
        IsAvailable = @isAvailable,
        ImageUrl    = @imageUrl
      WHERE ProductId = @id
    `);
  }

  static async delete(id) {
    await connect();
    const req = new sql.Request();
    req.input('id', sql.Int, id);
    await req.query(`
      DELETE FROM ${this.table}
      WHERE ProductId = @id
    `);
  }
}

module.exports = Product;
