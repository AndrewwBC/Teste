const db = require('../database/index');

class ContactsRepository {
  async findAll(orderBy = 'ASC') {
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const rows = await db.query(
      `SELECT contacts.*, categories.name AS category_name 
      FROM contacts
      LEFT JOIN categories ON categories.id = contacts.category_id
      ORDER BY contacts.name ${direction}`,
    );
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(
      ` 
      SELECT contacts.*, categories.name AS category_name
      FROM contacts
      LEFT JOIN categories ON categories.id = contacts.category_id
      where contacts.id = $1
      `,
      [id],
    );
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query(
      `SELECT * FROM contacts where contacts.email = $1`,
      [email],
    );
    return row;
  }

  async deleteUser(id) {
    const deleteOp = await db.query(
      `DELETE FROM contacts where contacts.id = $1
    `,
      [id],
    );
    return deleteOp;
  }

  async createContact({ name, email, phone, category_id }) {
    const [row] = await db.query(
      `
    INSERT INTO contacts(name, email, phone, category_id) 
    values ($1, $2, $3, $4)
    RETURNING *
    `,
      [name, email, phone, category_id],
    );
    return row;
  }

  async update(id, { name, email, phone, category_id }) {
    const [row] = await db.query(
      `
      UPDATE contacts
      SET name = $1, email = $2, phone = $3, category_id = $4 
      where contacts.id = $5
      RETURNING *
    `,
      [name, email, phone, category_id, id],
    );
    return row;
  }
}

module.exports = new ContactsRepository();
