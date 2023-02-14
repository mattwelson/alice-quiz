import {defineArrayMember, defineField, defineType} from 'sanity'
import {MdQuiz as icon} from 'react-icons/md'

export const home = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      initialValue: 'Type of hiker',
    }),
    defineField({
      name: 'requireEmail',
      title: 'Require Email',
      description: 'Require an email address before the quiz can be used',
      type: 'boolean',
    }),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{type: 'question'}],
        }),
      ],
    }),
  ],
})
