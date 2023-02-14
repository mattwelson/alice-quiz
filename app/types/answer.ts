import {z} from 'zod'
import {hikerTypeZ} from './hikerType'

// This is a Zod schema
// https://zod.dev/

// It will validate data at run time
// And generate Types during development
// Giving you both the flexibility of writing GROQ queries
// And the safety of Typescript
// without being limited to the shape of your Sanity Schema
export const answerZ = z.object({
  _key: z.string(),
  text: z.string().nullable(),
  weights: z.array(
    z.object({
      value: z.number().nullable(),
      type: hikerTypeZ,
    })
  ),
})

export type AnswerDocument = z.infer<typeof answerZ>

export const answersZ = z.array(answerZ)
