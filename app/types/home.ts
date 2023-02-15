import {hikerTypesZ} from './hikerType'
import {z} from 'zod'
import {questionsZ} from './question'

export const homeStubZ = z.object({
  title: z.string(),
})

export const homeZ = z.object({
  title: z.string(),
  questions: questionsZ.nullable(),
  hikerTypes: hikerTypesZ.nullable(),
})

export type HomeStubDocument = z.infer<typeof homeStubZ>
export type HomeDocument = z.infer<typeof homeZ>
