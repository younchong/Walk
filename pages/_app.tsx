import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Global } from '@emotion/react'
import global from "../styles/global";
import { RecoilRoot } from 'recoil';

declare global {
  interface Window {
    kakao: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Global styles={global} />
      <Component {...pageProps} />
    </RecoilRoot>
  )
}

export default MyApp
