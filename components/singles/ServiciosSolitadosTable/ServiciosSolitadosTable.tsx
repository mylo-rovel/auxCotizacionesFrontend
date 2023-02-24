import { FC, useEffect } from 'react';

import { IServiciosSolicitadosTableProps } from 'models';
import styles from "./ServiciosSolitadosTable.module.css";

export const ServiciosSolitadosTable: FC<IServiciosSolicitadosTableProps> = ({serviciosSolicitadosArr, coleccionServiciosPorID}) => {

    const summaryTableRows = serviciosSolicitadosArr.map((servicioItem, index) => {
        const idServicio = servicioItem.id;
        const serviceDataObj = coleccionServiciosPorID[idServicio];
        
        if (serviceDataObj) {
            const codigo = servicioItem.codigo;
            const descripcion = serviceDataObj.descripcion;
            const cantidad = servicioItem.cantidad;
            const valor = serviceDataObj.valor_unitario * cantidad;

            return <ServiciosSolitadosRow  
                codigo = {codigo}
                descripcion = {descripcion}
                cantidad = {cantidad}
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
                <section className={`${styles['custom-table-column-codigo']}`}>      <h4> Código       </h4> </section>
                <section className={`${styles['custom-table-column-descripcion']}`}> <h4> Descripcion  </h4> </section>
                <section className={`${styles['custom-table-column-cantidad']}`}>    <h4> Cantidad     </h4> </section>
                <section className={`${styles['custom-table-column-valor']}`}>       <h4> Valor        </h4> </section>
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
    descripcion: string;
    cantidad: number;
    valor: number;
}

const ServiciosSolitadosRow: FC<ServiciosSolitadosRowProps> = ({codigo, descripcion, cantidad, valor}) => {

    return (
        <>  
            <article className={styles['custom-table-row']}>
                <section className={`${styles['custom-table-column-codigo']} ${styles['custom-column-codigo-value']}`}>             <h4>{codigo}</h4>        </section>
                <section className={`${styles['custom-table-column-descripcion']} ${styles['custom-column-descripcion-value']}`}>   <h4>{descripcion}</h4>   </section>
                <section className={`${styles['custom-table-column-cantidad']} ${styles['custom-column-cantidad-value']}`}>         <h4>{cantidad}</h4>      </section>
                <section className={`${styles['custom-table-column-valor']} ${styles['custom-column-valor-value']}`}>               <h4>${valor}</h4>        </section>
            </article>
        </>
    )
}
