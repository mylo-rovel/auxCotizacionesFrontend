import { FC } from 'react';

import { DataRequester } from "apiClient";
import { IMainPageFrameProps } from 'models';
import styles from "./MainPageFrame.module.css";
import Image from 'next/image';


export const MainPageFrame: FC<IMainPageFrameProps> = () => {

    return (
        <>
        <article className={styles['main-page-frame-main-container']}>
            <section className={styles['main-page-temporal-title']}>
                <h1>Aplicación auxiliar para el registro de cotizaciones y servicios</h1>
            </section>
            <div className={styles['main-page-logo-container']}>
                <Image
                    src={`/img/cotizacionLogo.png`}
                    alt='logoCotizaciones'
                    fill
                    unoptimized
                />
            </div>
        </article>
        </>
    )
};