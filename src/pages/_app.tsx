import type { NextPage } from 'next';
import type { AppProps } from 'next/app';

import '../styles/globals.css';


export type NextPageWithLayout<P = {}, IP = P> = NextPage<P,IP> & {
  getLayout?: (page:JSX.Element) => JSX.Element;
}

type AppPropsWIthLayout = AppProps & {Component: NextPageWithLayout};

function App({ Component, pageProps }: AppPropsWIthLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <>
      <Component {...pageProps} />
    </>    
    )
}

export default App;