import type {LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import Layout from '~/components/Layout'
import Title from '~/components/Title'

import styles from '~/styles/app.build.css'
import {useRouteData} from 'remix-utils'
import type {HomeDocument} from '~/types/home'
import {homeZ} from '~/types/home'
import groq from 'groq'
import {getClient} from '~/sanity/client'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = (data) => {
  const home = data.parentsData.root.home as HomeDocument

  return {
    title: home.title ?? 'Alice Adventuring',
  }
}

export const loader = async (props: LoaderArgs) => {
  // TODO: hikerTypes may not be needed, or may only need id and slug
  const query = groq`*[_id == "home"][0]{
    title,    
    questions[]->{
      ...,
      answers[]{
        ...,
        weights[]{
          ...,
          type->
        }
      }
  },
  "hikerTypes": *[_type=="hikerType"][]{
    ...,
    "slug": slug.current
  }
}`

  const home = await getClient()
    .fetch(query)
    .then((res) => (res ? homeZ.parse(res) : null))

  if (!home) {
    throw new Response('Not found', {status: 404})
  }

  return json({home})
}

export default function Index() {
  const {
    home: {title},
  } = useRouteData(`root`) as {home: HomeDocument}
  const {
    home: {questions, hikerTypes},
  } = useLoaderData<typeof loader>()

  console.log({questions, hikerTypes})
  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 md:gap-12">
        {title ? <Title>{title}</Title> : null}
        {questions && questions?.length > 0 ? (
          <ul className="">
            {questions?.map((question) => (
              <li key={question._id} className="">
                <div>{question.text}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions found</p>
        )}
      </div>
    </Layout>
  )
}
