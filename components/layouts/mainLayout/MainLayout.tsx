import Head from "next/head";
import { FC, PropsWithChildren } from "react";

import { Navbar } from "components/singles";
import { IMainLayoutProps } from "models";

const defaultTitle = "Auxiliar Registro Trabajos";

export const MainLayout:FC<PropsWithChildren<IMainLayoutProps>> = ({children, title}) => {
    return (
      <>
        <Head>
            <title>{title || defaultTitle }</title>
            <meta name="author" content="Emilio Rojas" />
            <meta name="description" content={`Pagina auxiliar de registro de trabajos`} />
        </Head>
        
        <Navbar/>

        <main>
            {children}
        </main>
    </>
    )
};