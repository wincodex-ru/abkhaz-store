import Link from 'next/link'
import type { Post, Category } from '@/payload-types'
import { Pagination } from '../Pagination'
import { PostCard } from '../PostCard'
import { SearchInput } from '../SearchInput'
import styles from './index.module.css'

type Props = {
  posts: Post[]
  categories: Category[]
  currentPage: number
  totalPages: number
  query?: string
  activeCategorySlug?: string
  heading: string
  buildHref: (page: number) => string
  searchAction: string
  hiddenCategory?: string
  filters?: React.ReactNode
}

export function BlogIndex({
  posts,
  categories,
  currentPage,
  totalPages,
  query,
  activeCategorySlug,
  heading,
  buildHref,
  searchAction,
  hiddenCategory,
  filters,
}: Props) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.searchRow}>
          <SearchInput defaultValue={query} action={searchAction} hiddenCategory={hiddenCategory} />
          {filters}
        </div>

        {categories.length > 0 && (
          <nav className={styles.categories} aria-label="Категории">
            <Link
              href="/blog"
              className={`${styles.categoryLink} ${
                !activeCategorySlug ? styles.categoryActive : ''
              }`}
            >
              Все категории
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className={`${styles.categoryLink} ${
                  activeCategorySlug === cat.slug ? styles.categoryActive : ''
                }`}
              >
                {cat.title}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className={styles.content}>
        <h1 className={styles.title}>{heading}</h1>

        {posts.length === 0 ? (
          <p className={styles.empty}>
            {query ? `Ничего не найдено по запросу «${query}»` : 'Пока нет статей'}
          </p>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} buildHref={buildHref} />
      </main>
    </div>
  )
}
