import { CSSProperties, FC } from "react";
import { AutoComplete } from 'antd';

import { IMainServiciosFrameProps } from "models";
import styles from "./MainServiciosFrame.module.css";


const autoCompleteStyleObj: CSSProperties = {
    width: '90%',
    
}

export const MainServiciosFrame: FC<IMainServiciosFrameProps> = ({modoInterfaz, serviciosGuardados}) => {
    // const listaServicios = serviciosGuardados.map((servicio) => servicio.descripcion);
    const listaServicios = serviciosGuardados.map((servicio) => ({ value: servicio.descripcion }));


    return <>
    <section className={styles['main-frame-container']}>
        <section>
            <h1>{modoInterfaz} servicio</h1>            
        </section>
        <section className={`${styles['modify-servicio-name-container']}`}>
            <label><h2>Nombre/Descripción</h2></label>
            <AutoComplete
            options={listaServicios}
            style={autoCompleteStyleObj}
            // onSelect={onSelect}
            // onSearch={onSearch}
            placeholder="input here"
            className={`${styles['test']}`}
            />
        </section>
        
        <section className={`${styles['modify-servicio-price-container']}`}>
            <label><h2>Precio unitario</h2></label>
            <input type='number' min={0} id='modify-servicio-price-input' />
        </section>
    </section>
    </>
};