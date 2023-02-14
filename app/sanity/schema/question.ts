import {defineArrayMember, defineField, defineType} from 'sanity'
import {MdQuestionAnswer as icon} from 'react-icons/md'

export const question = defineType({
  name: 'question',
  title: 'Question',
  type: 'document',
  icon,
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'string',
    }),
    defineField({
      name: 'answers',
      title: 'Answers',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'answer',
        }),
      ],
    }),
  ],
})
