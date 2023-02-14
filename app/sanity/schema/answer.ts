import {defineType, defineField, defineArrayMember} from 'sanity'

export const answer = defineType({
  name: 'answer',
  title: 'Answer',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'weights',
      title: 'Weights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'weight',
        }),
      ],
    }),
  ],
})
