import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: Request) {
  const payload = await getPayload({ config })

  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const name = String(body?.name || '').trim()
  const email = String(body?.email || '')
    .trim()
    .toLowerCase()
  const password = String(body?.password || '')

  if (!name) {
    return NextResponse.json({ error: 'Введите имя', field: 'name' }, { status: 400 })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Некорректный email', field: 'email' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Минимум 8 символов', field: 'password' }, { status: 400 })
  }

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    return NextResponse.json({ error: 'Email уже занят', field: 'email' }, { status: 400 })
  }

  try {
    await payload.create({
      collection: 'users',
      data: { name, email, password, role: 'user' },
      overrideAccess: true,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Не удалось зарегистрироваться' },
      { status: 400 },
    )
  }

  const loginResult = await payload.login({
    collection: 'users',
    data: { email, password },
  })

  const res = NextResponse.json({ user: loginResult.user })
  if (loginResult.token) {
    res.cookies.set('payload-token', loginResult.token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    })
  }
  return res
}
