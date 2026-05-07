import { sql } from '@vercel/postgres'

export async function createUsersTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `
    return { success: true, message: 'Users table created successfully' }
  } catch (error) {
    return { success: false, message: `Error creating table: ${error}` }
  }
}

export async function insertUser(name: string, email: string, age: number) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, age)
      VALUES (${name}, ${email}, ${age})
      RETURNING *;
    `
    return { success: true, data: result.rows[0], message: 'User inserted successfully' }
  } catch (error) {
    return { success: false, message: `Error inserting user: ${error}` }
  }
}

export async function getUsers() {
  try {
    const result = await sql`SELECT * FROM users ORDER BY created_at DESC;`
    return { success: true, data: result.rows }
  } catch (error) {
    return { success: false, message: `Error fetching users: ${error}` }
  }
}

export async function getUserById(id: number) {
  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id};`
    return { success: true, data: result.rows[0] }
  } catch (error) {
    return { success: false, message: `Error fetching user: ${error}` }
  }
}

export async function deleteUser(id: number) {
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING *;`
    return { success: true, data: result.rows[0], message: 'User deleted successfully' }
  } catch (error) {
    return { success: false, message: `Error deleting user: ${error}` }
  }
}
