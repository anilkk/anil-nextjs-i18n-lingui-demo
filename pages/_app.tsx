import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { i18n } from '@lingui/core'
import { initTranslation } from '../utils'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import { I18nProvider } from '@lingui/react'

//initialization function
initTranslation(i18n)

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const locale: any = router.locale || router.defaultLocale
  const firstRender = useRef(true)

  if (pageProps.translation && firstRender.current) {
    //load the translations for the locale
    i18n.load(locale, pageProps.translation)
    i18n.activate(locale)
    // render only once
    firstRender.current = false
  }
  
  // listen for the locale changes
  useEffect(() => {
    if (pageProps.translation) {
      i18n.load(locale, pageProps.translation)
      i18n.activate(locale)
    }
  }, [locale, pageProps.translation])

  return  <>
      <I18nProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nProvider>
  </>
}

export default MyApp
