import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import global from "../styles/global";

declare global {
  interface Window {
    kakao: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Global styles={global} />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
