import App, { AppProps, AppContext } from 'next/app';
import Head from 'next/head'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>🔍 Buscador de Bibliotecas</title>
        <meta property="og:title" content="Buscador de Bibliotecas" key="title" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp;
