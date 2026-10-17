import Link from 'next/link'
import styles from './index.module.css'

type Item = {
  label: string
  href?: string
}

type Props = {
  items: Item[]
}

export function Breadcrumbs({ items }: Props) {
  return (
    <nav className={styles.root} aria-label="Хлебные крошки">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span> / </span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
