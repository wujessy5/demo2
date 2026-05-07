import { NextResponse } from 'next/server'
import { createUsersTable } from '@/lib/db'

export async function POST() {
  const result = await createUsersTable()
  return NextResponse.json(result)
}
