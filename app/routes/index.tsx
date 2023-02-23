import type {LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node'
import {Response} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import Layout from '~/components/Layout'
import Title from '~/components/Title'

import styles from '~/styles/app.build.css'
import {useRouteData} from 'remix-utils'
import type {HomeStubDocument} from '~/types/home'
import {homeZ} from '~/types/home'
import groq from 'groq'
import {getClient} from '~/sanity/client'
import {Question} from '~/components/question'
import {Quiz} from '~/components/quiz'

export const links: LinksFunction = () => {
  return [{rel: 'stylesheet', href: styles}]
}

export const meta: MetaFunction = (data) => {
  const home = data.parentsData.root.home as HomeStubDocument

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
          "slug": type->.slug.current,
          value
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
  } = useRouteData(`root`) as {home: HomeStubDocument}
  const {
    home: {questions, hikerTypes},
  } = useLoaderData<typeof loader>()

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-6 md:gap-12">
        {title ? <Title>{title}</Title> : null}
        <Quiz questions={questions} />
        {questions && questions?.length > 0 ? (
          <ul className="grid gap-8">
            {questions?.map((question) => (
              <Question
                questionClicked={console.log}
                key={question._id}
                question={question}
                showWeights={false}
              ></Question>
            ))}
          </ul>
        ) : (
          <p>No questions found</p>
        )}
      </div>
    </Layout>
  )
}
