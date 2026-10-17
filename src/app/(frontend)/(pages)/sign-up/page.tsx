import type { Metadata } from 'next'
import { SignUpForm } from './_components/SignUpForm'

export const metadata: Metadata = {
  title: 'Регистрация — Apsgram',
  robots: { index: false, follow: false },
}

export default function SignUpPage() {
  return <SignUpForm />
}
