import Link from 'next/link'
import type { Post, Category } from '@/payload-types'
import { PostCard } from '@/app/(frontend)/blog/_components/PostCard'
import { Pagination } from '@/app/(frontend)/blog/_components/Pagination'
import { SearchInput } from '@/app/(frontend)/blog/_components/SearchInput'
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
}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.root}>
        <SearchInput defaultValue={query} action={searchAction} hiddenCategory={hiddenCategory} />

        {categories.length > 0 && (
          <nav className={styles.categories}>
            <Link
              href="/blog"
              className={`${styles.categoryLink} ${
                !activeCategorySlug ? styles.categoryActive : ''
              }`}
            >
              Все
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
      </div>

      <section className={styles.gridSection}>
        <div className={styles.gridInner}>
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
        </div>
      </section>
    </div>
  )
}
