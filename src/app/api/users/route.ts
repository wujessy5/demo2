import { NextResponse } from 'next/server'
import { createUsersTable, insertUser, getUsers, deleteUser } from '@/lib/db'

export async function GET() {
  const result = await getUsers()
  return NextResponse.json(result)
}

export async function POST(request: Request) {
  const { name, email, age } = await request.json()
  
  if (!name || !email) {
    return NextResponse.json(
      { success: false, message: 'Name and email are required' },
      { status: 400 }
    )
  }

  const result = await insertUser(name, email, age || 0)
  return NextResponse.json(result)
}

export async function DELETE(request: Request) {
  const { id } = await request.json()
  
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'User ID is required' },
      { status: 400 }
    )
  }

  const result = await deleteUser(id)
  return NextResponse.json(result)
}
