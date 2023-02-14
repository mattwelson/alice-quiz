import {defineType, defineField} from 'sanity'

export const weight = defineType({
  name: 'weight',
  title: 'Weight',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'reference',
      to: [{type: 'hikerType'}],
    }),
    defineField({
      name: 'value',
      title: 'Value',
      type: 'number',
      initialValue: 1,
    }),
  ],
  preview: {
    select: {
      title: 'type.title',
      subtitle: 'value',
    },
  },
})
