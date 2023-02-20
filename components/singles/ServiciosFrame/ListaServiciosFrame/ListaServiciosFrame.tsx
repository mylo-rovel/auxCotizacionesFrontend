import { FC } from "react";

import styles from "./ListaServiciosFrame.module.css";
import { IListaServGuardadosFrameProps } from "models";


export const ListaServiciosFrame: FC<IListaServGuardadosFrameProps> = ({serviciosGuardados}) => {
    const ListaServiciosGuardados = (): JSX.Element => {
        const innerListaElementos = serviciosGuardados.map((servicio, index) => {
            return (
                <section key={`serviAlfa_${index}`} className={styles['servicio-row-container']}>
                    <h3>{servicio.descripcion}</h3>
                    <h3>${servicio.valor_unitario} c/u</h3>
                    {/* <h3>{servicio.descripcion + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}</h3> */}
                </section>
            )
        })
        return( <> {innerListaElementos} </> )
    }

    return <>
    <article className={styles['lista-servicios-container']}>
        <section className={styles['servicios-guardados-title']}>
            <h2>Servicios guardados</h2>
        </section>
        <ListaServiciosGuardados/>      
    </article>
    </>
};