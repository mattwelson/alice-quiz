import type {ActionFunction, LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import groq from 'groq'
import {PreviewSuspense} from '@sanity/preview-kit'

import styles from '~/styles/app.build.css'
import Record, {PreviewRecord} from '~/components/Record'
import {getClient, writeClient} from '~/sanity/client'
import {questionZ, questionsZ} from '~/types/question'
import {getSession} from '~/sessions'
import type {HomeDocument} from '~/types/home'
import {HikerTypeDocument, hikerTypeZ} from '~/types/hikerType'
import Title from '~/components/Title'
import Layout from '~/components/Layout'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = ({data, parentsData}) => {
  const home = parentsData.root.home as HomeDocument

  return {
    title: [data.hikerType.title, home.title].filter(Boolean).join(' | '),
  }
}

// Load the `record` document with this slug
export const loader = async ({params, request}: LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const token = session.get('token')
  const preview = Boolean(token)

  const query = groq`*[_type == "hikerType" && slug.current == $slug][0]{
    title,
    _id,
    "slug": slug.current
  }`

  const hikerType = await getClient(preview)
    // Params from the loader uses the filename
    // $slug.tsx has the params { slug: 'hello-world' }
    .fetch(query, params)
    // Parsed with Zod to validate data at runtime
    // and generate a Typescript type
    .then((res) => (res ? hikerTypeZ.parse(res) : null))

  if (!hikerType) {
    throw new Response('Not found', {status: 404})
  }

  return json({
    hikerType,
    preview,
    query: preview ? query : null,
    params: preview ? params : null,
    // Note: This makes the token available to the client if they have an active session
    // This is useful to show live preview to unauthenticated users
    // If you would rather not, replace token with `null` and it will rely on your Studio auth
    token: preview ? token : null,
  })
}

export function HikerType({title}: HikerTypeDocument) {
  return (
    <Layout>
      <Title>{title}</Title>
    </Layout>
  )
}

export default function HikerTypePage() {
  const {hikerType, preview, query, params, token} = useLoaderData<typeof loader>()

  if (preview && query && params && token) {
    return (
      <PreviewSuspense fallback={<HikerType {...hikerType} />}>
        <PreviewRecord query={query} params={params} token={token} />
      </PreviewSuspense>
    )
  }

  return <HikerType {...hikerType} />
}
