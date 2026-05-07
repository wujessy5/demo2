import { sql } from '@vercel/postgres'

interface User {
  id: number
  name: string
  email: string
  age: number
  created_at: string
}

let mockUsers: User[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com', age: 25, created_at: '2024-01-15 10:30:00' },
  { id: 2, name: '李四', email: 'lisi@example.com', age: 30, created_at: '2024-01-14 09:15:00' },
  { id: 3, name: '王五', email: 'wangwu@example.com', age: 28, created_at: '2024-01-13 14:20:00' },
]

let nextId = 4

const useMockData = !process.env.POSTGRES_URL || process.env.POSTGRES_URL === ''

export async function createUsersTable() {
  if (useMockData) {
    return { success: true, message: 'Using mock data mode - table created successfully' }
  }
  
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
  if (useMockData) {
    const newUser: User = {
      id: nextId++,
      name,
      email,
      age,
      created_at: new Date().toISOString()
    }
    mockUsers.unshift(newUser)
    return { success: true, data: newUser, message: 'User inserted successfully (mock mode)' }
  }
  
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
  if (useMockData) {
    return { success: true, data: mockUsers }
  }
  
  try {
    const result = await sql`SELECT * FROM users ORDER BY created_at DESC;`
    return { success: true, data: result.rows }
  } catch (error) {
    return { success: false, message: `Error fetching users: ${error}` }
  }
}

export async function getUserById(id: number) {
  if (useMockData) {
    const user = mockUsers.find(u => u.id === id)
    return { success: true, data: user }
  }
  
  try {
    const result = await sql`SELECT * FROM users WHERE id = ${id};`
    return { success: true, data: result.rows[0] }
  } catch (error) {
    return { success: false, message: `Error fetching user: ${error}` }
  }
}

export async function deleteUser(id: number) {
  if (useMockData) {
    const index = mockUsers.findIndex(u => u.id === id)
    if (index !== -1) {
      const deletedUser = mockUsers[index]
      mockUsers.splice(index, 1)
      return { success: true, data: deletedUser, message: 'User deleted successfully (mock mode)' }
    }
    return { success: false, message: 'User not found' }
  }
  
  try {
    const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING *;`
    return { success: true, data: result.rows[0], message: 'User deleted successfully' }
  } catch (error) {
    return { success: false, message: `Error deleting user: ${error}` }
  }
}
