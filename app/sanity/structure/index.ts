import type {DefaultDocumentNodeResolver, StructureResolver} from 'sanity/desk'
import Iframe from 'sanity-plugin-iframe-pane'
import {MdQuiz, MdHiking, MdQuestionAnswer} from 'react-icons/md'

import {projectDetails} from '~/sanity/projectDetails'
import type {SanityDocumentWithSlug} from '~/sanity/structure/resolvePreviewUrl'
import {resolvePreviewUrl} from '~/sanity/structure/resolvePreviewUrl'

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // Singleton, home page curation
      S.documentListItem().schemaType('home').icon(MdQuiz).id('home').title('Home'),
      S.divider(),
      // Document lists
      S.documentTypeListItem('question').title('Questions').icon(MdQuestionAnswer),
      S.documentTypeListItem('hikerType').title('Types of Hikers').icon(MdHiking),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType, getClient}) => {
  const {apiVersion} = projectDetails()
  const client = getClient({apiVersion})

  switch (schemaType) {
    case `question`:
      return S.document().views([
        S.view.form(),
        S.view
          .component(Iframe)
          .options({
            url: (doc: SanityDocumentWithSlug) => resolvePreviewUrl(doc, client),
            reload: {button: true},
          })
          .title('Preview'),
      ])

    default:
      return S.document().views([S.view.form()])
  }
}
