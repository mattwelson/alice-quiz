import {defineField, defineType} from 'sanity'
import {MdHiking as icon} from 'react-icons/md'

export const hikerType = defineType({
  name: 'hikerType',
  title: 'Type of Hiker',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      //hidden: true,
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'link',
      type: 'url',
      title: 'Link to description',
    }),
  ],
})
