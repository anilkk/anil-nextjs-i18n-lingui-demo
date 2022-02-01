This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Steps 1

```sh
npm install --save-dev @lingui/cli @lingui/loader @lingui/macro babel-plugin-macros @babel/core
npm install --save @lingui/react make-plural

```

## Step 2

```js
//next.config.js

module.exports = {
  i18n: {
    locales: ["en", "sr", "es", "pseudo"],
    defaultLocale: "en",
  },
};
```

## Step 3

```js
// lingui.config.js

module.exports = {
  locales: ["en", "sr", "es", "pseudo"],
  pseudoLocale: "pseudo",
  sourceLocale: "en",
  fallbackLocales: {
    default: "en",
  },
  catalogs: [
    {
      path: "src/translations/locales/{locale}/messages",
      include: ["src/pages", "src/components"],
    },
  ],
  format: "po",
};
```

## Step 4

```js
// src/components/AboutText.jsx

import { Trans } from "@lingui/macro";

function AboutText() {
  return (
    <p>
      <Trans id="next-explanation">My text to be translated</Trans>
    </p>
  );
}
```

## Step 5

```
// .babelrc

{
  "presets": ["next/babel"],
  "plugins": ["macros"]
}
```

Add these scripts to `package.json`

```sh

"lingui-extract": " NODE_ENV=development lingui extract --clean",
"lingui-compile": "NODE_ENV=production lingui compile"
```

## Step 6

```jsx
// utils.ts

import type { I18n } from "@lingui/core";
import { en, es, sr } from "make-plural/plurals";

//anounce which locales we are going to use and connect them to approprite plural rules
export function initTranslation(i18n: I18n): void {
  i18n.loadLocaleData({
    en: { plurals: en },
    sr: { plurals: sr },
    es: { plurals: es },
    pseudo: { plurals: en },
  });
}
```

## Step 7

```tsx
// _app.tsx

import { i18n } from "@lingui/core";
import { initTranslation } from "../utils";

//initialization function
initTranslation(i18n);

function MyApp({ Component, pageProps }) {
  // code ommited
}
```

## Step 8

Add additional code

```tsx
// _app.tsx
// add these code
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { I18nProvider } from "@lingui/react";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const locale: any = router.locale || router.defaultLocale;
  const firstRender = useRef(true);

  if (pageProps.translation && firstRender.current) {
    //load the translations for the locale
    i18n.load(locale, pageProps.translation);
    i18n.activate(locale);
    // render only once
    firstRender.current = false;
  }

  return (
    <>
      <I18nProvider i18n={i18n}>
        <Component {...pageProps} />
      </I18nProvider>
    </>
  );
}

export default MyApp;
```

## Step 9

```tsx
// src/pages/index.tsx

export const getStaticProps: GetStaticProps = async (ctx) => {
  const translation = await loadTranslation(
    ctx.locale!,
    process.env.NODE_ENV === "production"
  );

  return {
    props: {
      translation,
    },
  };
};
```

## Step 10

Changing the language dynamically

```tsx
// src/pages/_app.tsx
function MyApp({ Component, pageProps }: AppProps) {
// other code

// listen for the locale changes
  useEffect(() => {
    if (pageProps.translation) {
      i18n.load(locale, pageProps.translation)
      i18n.activate(locale)
    }
  }, [locale, pageProps.translation])
// remaining code
```

## Step 11

```tsx
// src/components/Switcher.tsx

import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { t } from "@lingui/macro";

type LOCALES = "en" | "sr" | "es" | "pseudo";

export function Switcher() {
  const router = useRouter();
  const [locale, setLocale] = useState<LOCALES>(
    router.locale!.split("-")[0] as LOCALES
  );

  const languages: { [key: string]: string } = {
    en: t`English`,
    sr: t`Serbian`,
    es: t`Spanish`,
  };

  // enable 'pseudo' locale only for development environment
  if (process.env.NEXT_PUBLIC_NODE_ENV !== "production") {
    languages["pseudo"] = t`Pseudo`;
  }

  useEffect(() => {
    router.push(router.pathname, router.pathname, { locale });
  }, [locale, router]);

  return (
    <select
      value={locale}
      onChange={(evt) => setLocale(evt.target.value as LOCALES)}
    >
      {Object.keys(languages).map((locale) => {
        return (
          <option value={locale} key={locale}>
            {languages[locale as unknown as LOCALES]}
          </option>
        );
      })}
    </select>
  );
}
```

## Step 12

Create Switcher component and import index.tsx
