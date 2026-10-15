import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    admin: ({ req: { user } }) => user?.role === 'admin',
    create: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.id) return { id: { equals: user.id } }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true
      if (user?.id) return { id: { equals: user.id } }
      return false
    },
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'user',
      options: ['admin', 'user'],
      access: {
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
