import App, { AppProps, AppContext } from 'next/app';
import Head from 'next/head'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Wanna HangOut</title>
        <meta property="og:title" content="Wanna HangOut" key="title" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
