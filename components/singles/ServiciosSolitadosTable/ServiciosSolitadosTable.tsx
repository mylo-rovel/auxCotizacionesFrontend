import { FC } from 'react';

import { IServiciosSolicitadosTableProps } from 'models';
import styles from "./ServiciosSolitadosTable.module.css";

export const ServiciosSolitadosTable: FC<IServiciosSolicitadosTableProps> = (props) => {
    const {serviciosSolicitadosArr, dict_IdTrabajo_DatosTrabajo} = props;

    const summaryTableRows = serviciosSolicitadosArr.map((servicioItem, index) => {
        const idServicio = servicioItem.id;
        const serviceDataObj = dict_IdTrabajo_DatosTrabajo[idServicio];
        
        if (serviceDataObj) {
            const { codigo, detalle_servicio, equipo, valor } = serviceDataObj;

            return <ServiciosSolitadosRow  
                codigo = {codigo}
                detalle_servicio = {detalle_servicio}
                equipo = {equipo}
                valor = {valor}
                key={`summaryTableRow_${index}`}
                />
        }
        return <></>;

    })

    return (
        <>  
        <article className={styles['summary-servicios-solicitados-container']}>
            <article className={`${styles['custom-table-row']} ${styles['custom-table-row-header']}`}>
                <section className={`${styles['custom-table-column-codigo']}`}>          <h4> Código    </h4> </section>
                <section className={`${styles['custom-table-column-detalleservicio']}`}> <h4> Detalle   </h4> </section>
                <section className={`${styles['custom-table-column-equipo']}`}>          <h4> Equipo    </h4> </section>
                <section className={`${styles['custom-table-column-valor']}`}>           <h4> Valor     </h4> </section>
            </article>
            {summaryTableRows}
        </article>
        </>
    )
}

//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*- SPECIFIC COMPONENTS ---------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------


interface ServiciosSolitadosRowProps {
    codigo: string;
    detalle_servicio: string;
    equipo: string;
    valor: number;
}

const ServiciosSolitadosRow: FC<ServiciosSolitadosRowProps> = ({codigo, detalle_servicio, equipo, valor}) => {

    return (
        <>  
            <article className={styles['custom-table-row']}>
                <section className={`${styles['custom-table-column-codigo']}            ${styles['custom-column-codigo-value']}`}>            <h4>{codigo}</h4>               </section>
                <section className={`${styles['custom-table-column-detalleservicio']}   ${styles['custom-column-detalleservicio-value']}`}>   <h4>{detalle_servicio}</h4>     </section>
                <section className={`${styles['custom-table-column-equipo']}            ${styles['custom-column-equipo-value']}`}>            <h4>{equipo}</h4>               </section>
                <section className={`${styles['custom-table-column-valor']}             ${styles['custom-column-valor-value']}`}>             <h4>${valor}</h4>               </section>
            </article>
        </>
    )
}
