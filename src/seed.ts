import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'

const categories = [
  {
    title: 'Природа и ландшафты',
    slug: 'priroda',
    description: 'Горы, ущелья, водопады, озёра, пещеры, леса',
  },
  {
    title: 'Города и деревни',
    slug: 'goroda-i-derevni',
    description: 'Сухум, Гагра, Новый Афон, Пицунда, Гудаута, сёла',
  },
  {
    title: 'Места и маршруты',
    slug: 'mesta-i-marshruty',
    description: 'Достопримечательности, храмы, крепости, маршруты',
  },
  {
    title: 'Справочник',
    slug: 'spravochnik',
    description: 'Полезная информация для туристов',
  },
  {
    title: 'Еда и напитки',
    slug: 'eda-i-napitki',
    description: 'Кухня, виноделие, чай, кофе, мёд',
  },
  {
    title: 'Культура и традиции',
    slug: 'kultura-i-traditsii',
    description: 'Апсуара, обычаи, обряды, праздники, язык, диаспора',
  },
  {
    title: 'История и наследие',
    slug: 'istoriya-i-nasledie',
    description: 'Древность, средневековье, советский период, война 1992–1993',
  },
  {
    title: 'Архитектура',
    slug: 'arhitektura',
    description: 'Храмы, крепости, памятники, советский модернизм',
  },
]

async function seed() {
  const payload = await getPayload({ config })

  for (const cat of categories) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'categories',
        id: existing.docs[0].id,
        data: cat,
      })
      console.log(`updated category: ${cat.slug}`)
    } else {
      await payload.create({ collection: 'categories', data: cat })
      console.log(`created category: ${cat.slug}`)
    }
  }

  console.log('seed done')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
