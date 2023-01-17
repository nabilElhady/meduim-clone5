import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'comment',
  type: 'document',
  title: 'Comment',
  fields: [
    defineType({
      name: 'name',
      type: 'string',
    }),
    defineType({
      title: 'Approved',
      name: 'approved',
      type: 'boolean',
      description: "Comments won't show on the site without approval",
    }),
    defineType({
      name: 'email',
      type: 'string',
    }),
    defineType({
      name: 'comment',
      type: 'text',
    }),
    defineType({
      name: 'post',
      type: 'reference',
      to: [{type: 'post'}],
    }),
  ],
})
