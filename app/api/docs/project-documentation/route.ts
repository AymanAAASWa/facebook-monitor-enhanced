import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  const filePath = path.join(process.cwd(), 'docs', 'project-documentation.md')

  try {
    const content = await readFile(filePath, 'utf-8')
    return NextResponse.json({ success: true, content })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'File not found' }, { status: 404 })
  }
}
