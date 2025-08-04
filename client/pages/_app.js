import '../styles/globals.css'
import Layout from '../components/Layout'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content="أعمالي بالطين - متجر المصنوعات اليدوية من الطين البوليمر" />
        <meta name="keywords" content="طين بوليمر, مصنوعات يدوية, ميدالية مفاتيح, هدايا مخصصة, عربي" />
        <title>أعمالي بالطين - متجر المصنوعات اليدوية</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default MyApp