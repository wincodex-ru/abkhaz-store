'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Form } from '@/components/Form'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAlert } from '@/components/Alert'
import styles from './index.module.css'

type Errors = {
  email?: string
  password?: string
}

export function SignInForm() {
  const router = useRouter()
  const alert = useAlert()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [values, setValues] = useState({ email: '', password: '' })

  const setField = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Errors = {}
    if (!values.email.trim()) next.email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Некорректный email'
    if (!values.password) next.password = 'Введите пароль'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        alert.error(data?.errors?.[0]?.message || 'Неверный email или пароль')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      alert.error('Сетевая ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>Вход</h1>
      <Form onSubmit={onSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          value={values.email}
          onChange={setField('email')}
          error={errors.email}
          autoComplete="email"
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Пароль"
          value={values.password}
          onChange={setField('password')}
          error={errors.password}
          autoComplete="current-password"
        />
        <Button type="submit" loading={loading} full>
          Войти
        </Button>
      </Form>
      <p className={styles.footer}>
        Нет аккаунта? <Link href="/sign-up">Зарегистрироваться</Link>
      </p>
    </div>
  )
}
