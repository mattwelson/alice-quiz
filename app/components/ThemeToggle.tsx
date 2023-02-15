import {Sun, Moon} from 'lucide-react'
import {useFetcher, useRouteLoaderData} from '@remix-run/react'

export default function ThemeToggle() {
  const cookieToggle = useFetcher()
  const {themePreference} = useRouteLoaderData(`root`) as {themePreference: string}
  const themePref = cookieToggle?.submission?.formData.get('newMode') ?? themePreference
  const isDarkMode = themePref === `dark`

  return (
    <cookieToggle.Form method="post" action="/resource/toggle-theme">
      <button type="submit" disabled={cookieToggle.state === 'submitting'}>
        {isDarkMode ? <Sun className="h-auto w-4" /> : <Moon className="h-auto w-4" />}
        <div className="sr-only select-none">{isDarkMode ? `Light` : `Dark`} Mode</div>
      </button>
      <input type="hidden" name="newMode" value={isDarkMode ? `light` : `dark`} />
    </cookieToggle.Form>
  )
}
