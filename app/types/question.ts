import {z} from 'zod'
import {answersZ} from './answer'

// This is a Zod schema
// https://zod.dev/

// It will validate data at run time
// And generate Types during development
// Giving you both the flexibility of writing GROQ queries
// And the safety of Typescript
// without being limited to the shape of your Sanity Schema
export const questionZ = z.object({
  _id: z.string(),
  text: z.string().nullable(),
  answers: answersZ,
})

export type QuestionDocument = z.infer<typeof questionZ>

export const questionsZ = z.array(questionZ)
