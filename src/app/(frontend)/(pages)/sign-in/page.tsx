// import type { Metadata } from 'next'
// import { SignInForm } from './_components/SignInForm'

// export const metadata: Metadata = {
//   title: 'Вход — Abkhaz Store',
//   robots: { index: false, follow: false },
// }

// export default function SignInPage() {
//   return <SignInForm />
// }

import { redirect } from 'next/navigation'

export default function SignInPage() {
  redirect('/blog')
}
