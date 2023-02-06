import { FC, useEffect, useState } from 'react';

import { DataRequester } from "apiClient";
import styles from "./ServiciosFrame.module.css";
import { IServiciosFrameProps, IServicioData, modoInterfazServicios } from "models";
import { ListaServiciosFrame } from "./ListaServiciosFrame/ListaServiciosFrame";
import { MainServiciosFrame } from "./MainServiciosFrame/MainServiciosFrame";
import { ModifyServicioFrame } from "./ModifyServicioFrame/ModifyServicioFrame";

export const ServiciosFrame: FC<IServiciosFrameProps> = () => {
    const [serviciosGuardados, setListaServGuardados] = useState<IServicioData[]>([]);
    const [modoInterfaz, setModoInterfaz] = useState<modoInterfazServicios>('AGREGAR');

    useEffect(() => {
        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios();
            setListaServGuardados(serviciosArr);
        }
        fetchServicios();
    }, []);

    return <>
    <section className={styles['servicios-frame-container']}>
        <ModifyServicioFrame displayFrame={true}/>
        <MainServiciosFrame serviciosGuardados={serviciosGuardados} modoInterfaz={modoInterfaz}/>
        <ListaServiciosFrame serviciosGuardados={serviciosGuardados} />
    </section>
    </>
};