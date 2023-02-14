import {z} from 'zod'

// This is a Zod schema
// https://zod.dev/

// It will validate data at run time
// And generate Types during development
// Giving you both the flexibility of writing GROQ queries
// And the safety of Typescript
// without being limited to the shape of your Sanity Schema
export const hikerTypeZ = z.object({
  _id: z.string(),
})

export type TypeOfHikerDocument = z.infer<typeof hikerTypeZ>

export const hikerTypesZ = z.array(hikerTypeZ)
