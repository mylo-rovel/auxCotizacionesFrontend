import Head from "next/head";
import { FC, PropsWithChildren } from "react";

import { IMainLayoutProps } from "../../../models";
import { Navbar } from "components/singles";

const defaultTitle = "my tutilo";

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