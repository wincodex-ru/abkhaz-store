// import type { Metadata } from 'next'
// import { SignUpForm } from './_components/SignUpForm'

// export const metadata: Metadata = {
//   title: 'Регистрация — Abkhaz Store',
//   robots: { index: false, follow: false },
// }

// export default function SignUpPage() {
//   return <SignUpForm />
// }

import { redirect } from 'next/navigation'

export default function SignUpPage() {
  redirect('/blog')
}
