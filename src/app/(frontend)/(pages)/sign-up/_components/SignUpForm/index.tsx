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
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function SignUpForm() {
  const router = useRouter()
  const alert = useAlert()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const setField = (field: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const validate = (): boolean => {
    const next: Errors = {}
    if (!values.name.trim()) next.name = 'Введите имя'
    if (!values.email.trim()) next.email = 'Введите email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Некорректный email'
    if (!values.password) next.password = 'Введите пароль'
    else if (values.password.length < 8) next.password = 'Минимум 8 символов'
    if (values.password !== values.confirmPassword) next.confirmPassword = 'Пароли не совпадают'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (data?.field) {
          setErrors((er) => ({ ...er, [data.field]: data.error }))
        } else {
          alert.error(data?.error || 'Не удалось зарегистрироваться')
        }
        return
      }

      alert.success('Готово!')
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
      <h1 className={styles.title}>Регистрация</h1>
      <Form onSubmit={onSubmit}>
        <Input
          id="name"
          name="name"
          label="Отображаемое имя"
          value={values.name}
          onChange={setField('name')}
          error={errors.name}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Повторите пароль"
          value={values.confirmPassword}
          onChange={setField('confirmPassword')}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} full>
          Зарегистрироваться
        </Button>
      </Form>
      <p className={styles.footer}>
        Уже есть аккаунт? <Link href="/sign-in">Войти</Link>
      </p>
    </div>
  )
}
