import type { Post } from '@/payload-types'
import { PostCard } from '../../../_components/PostCard'
import styles from './index.module.css'

type Props = {
  posts: Post[]
}

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className={styles.root} aria-labelledby="related-posts-title">
      <h2 id="related-posts-title" className={styles.title}>
        Похожие статьи
      </h2>
      <div className={styles.grid}>
        {posts.map((post, i) => (
          <PostCard key={post.id} post={post} priority={i < 3} />
        ))}
      </div>
    </section>
  )
}
