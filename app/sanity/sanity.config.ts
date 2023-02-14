import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'

import {projectDetails} from '~/sanity/projectDetails'
import {schemaTypes} from '~/sanity/schema'
import {structure, defaultDocumentNode} from '~/sanity/structure'

export const config = defineConfig({
  ...projectDetails(),
  name: 'sanity-remix',
  title: 'Sanity Remix',
  plugins: [deskTool({structure, defaultDocumentNode}), visionTool()],
  basePath: `/studio`,
  schema: {
    types: schemaTypes,
  },
})
