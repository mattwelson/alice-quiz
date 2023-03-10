import type {LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useFetchers,
  useLoaderData,
  useLocation,
} from '@remix-run/react'
import groq from 'groq'

import {getClient} from '~/sanity/client'
import {homeStubZ} from '~/types/home'
import {themePreferenceCookie} from '~/cookies'
import {z} from 'zod'
import {getBodyClassNames} from './lib/getBodyClassNames'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  return [
    {rel: 'preconnect', href: 'https://cdn.sanity.io'},
    {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
    {rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous'},
    {
      href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=Inter:wght@500;700;800&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
      rel: 'stylesheet',
    },
  ]
}

export const loader = async ({request}: LoaderArgs) => {
  // Dark/light mode
  const cookieHeader = request.headers.get('Cookie')
  const cookie = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const themePreference = z
    .union([z.literal('dark'), z.literal('light')])
    .optional()
    .parse(cookie.themePreference)

  // Sanity content throughout the site
  const query = groq`*[_id == "home"][0]{
    title
  }`
  const home = await getClient()
    .fetch(query)
    .then((res) => (res ? homeStubZ.parse(res) : null))

  return json({
    home,
    themePreference,
    ENV: {
      SANITY_PUBLIC_PROJECT_ID: process.env.SANITY_PUBLIC_PROJECT_ID,
      SANITY_PUBLIC_DATASET: process.env.SANITY_PUBLIC_DATASET,
      SANITY_PUBLIC_API_VERSION: process.env.SANITY_PUBLIC_API_VERSION,
      SANITY_PUBLIC_REMOTE_URL: process.env.SANITY_PUBLIC_REMOTE_URL,
    },
  })
}

export default function App() {
  const {ENV, themePreference} = useLoaderData<typeof loader>()

  const {pathname} = useLocation()
  const isStudioRoute = pathname.startsWith('/studio')

  // optimistic UI for theme preference -
  // get the inflight fetcher submission to override the themePreference
  // TODO: wrap in custom hook
  const fetchers = useFetchers()
  const cookieFetcher = fetchers
    .filter((x) => x.state != 'idle')
    .find((x) => x.submission?.action === '/resource/toggle-theme')
  const themeFromSubmission = cookieFetcher?.submission?.formData.get('newMode')

  const bodyClassNames = getBodyClassNames(themeFromSubmission ?? themePreference)

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
        {isStudioRoute && typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body className={bodyClassNames}>
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
