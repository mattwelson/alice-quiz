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

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = ({data, parentsData}) => {
  const home = parentsData.root.home as HomeDocument

  return {
    title: [data.question.title, home.title].filter(Boolean).join(' | '),
  }
}

// Load the `record` document with this slug
export const loader = async ({params, request}: LoaderArgs) => {
  const session = await getSession(request.headers.get('Cookie'))
  const token = session.get('token')
  const preview = Boolean(token)

  const query = groq`*[_type == "record" && slug.current == $slug][0]{
    _id,
    title,
    // GROQ can re-shape data in the request!
    "slug": slug.current,
    "artist": artist->title,
    // coalesce() returns the first value that is not null
    // so we can ensure we have at least a zero
    "likes": coalesce(likes, 0),
    "dislikes": coalesce(dislikes, 0),
    // for simplicity in this demo these are typed as "any"
    // we can make them type-safe with a little more work
    // https://www.simeongriggs.dev/type-safe-groq-queries-for-sanity-data-with-zod
    image,
    content,
    // this is how we extract values from arrays
    tracks[]{
      _key,
      title,
      duration
    }
  }`

  const record = await getClient(preview)
    // Params from the loader uses the filename
    // $slug.tsx has the params { slug: 'hello-world' }
    .fetch(query, params)
    // Parsed with Zod to validate data at runtime
    // and generate a Typescript type
    .then((res) => (res ? questionZ.parse(res) : null))

  if (!record) {
    throw new Response('Not found', {status: 404})
  }

  return json({
    record,
    preview,
    query: preview ? query : null,
    params: preview ? params : null,
    // Note: This makes the token available to the client if they have an active session
    // This is useful to show live preview to unauthenticated users
    // If you would rather not, replace token with `null` and it will rely on your Studio auth
    token: preview ? token : null,
  })
}

export default function RecordPage() {
  const {record, preview, query, params, token} = useLoaderData<typeof loader>()

  if (preview && query && params && token) {
    return (
      <PreviewSuspense fallback={<Record {...record} />}>
        <PreviewRecord query={query} params={params} token={token} />
      </PreviewSuspense>
    )
  }

  return <Record {...record} />
}
