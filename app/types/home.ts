import {hikerTypesZ} from './hikerType'
import {z} from 'zod'
import {questionsZ} from './question'

export const homeZ = z.object({
  title: z.string().nullable(),
  questions: questionsZ.nullable().optional(),
  hikerTypes: hikerTypesZ.nullable().optional(),
})

export type HomeDocument = z.infer<typeof homeZ>
