import { FC, CSSProperties, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { AutoComplete } from 'antd';


import { enviarDatosServicio } from 'utils';
import styles from './MainServiciosFrame.module.css';
import { IMainServiciosFrameProps, modoInterfazServicios } from 'models';

// ---------------------------------------------------------------
// ---------------------------------------------------------------
type modoMapColor = {
    [key in modoInterfazServicios]: string;
};
const coloresModo: modoMapColor = {
    AGREGAR: 'green',
    MODIFICAR: 'yellow',
    ELIMINAR: 'red'
}
interface IButtonModeadoProps {
    modoObjetivo: modoInterfazServicios;
    modoActivo: modoInterfazServicios;
    setNewMode: Dispatch<SetStateAction<modoInterfazServicios>>
}
const ButtonModeado:FC<IButtonModeadoProps> = ({modoObjetivo, modoActivo, setNewMode}): JSX.Element => {
    const colorBoton = coloresModo[modoObjetivo];
    const buttonStyles: CSSProperties = {
        backgroundColor: colorBoton
    }

    const classToUse = (modoObjetivo === modoActivo) ? '' : styles['unactive-mode-button'];

    return (
        <>
            <button onClick={() => setNewMode(modoObjetivo)} className={classToUse} style={buttonStyles}>
                <h4>{modoObjetivo}</h4>
            </button>
        </>
    )
}
// ---------------------------------------------------------------
// ---------------------------------------------------------------


export const MainServiciosFrame: FC<IMainServiciosFrameProps> = ({modoInterfaz, serviciosGuardados, mainServicioSetter, mainPrecioSetter, modoSetter, datosServicioEnviar}) => {
    const listaServicios = serviciosGuardados.map((servicio) => ({ value: servicio }));
    const isAgregarMode = (modoInterfaz === 'AGREGAR');

    const setName = (serviceNameValue: unknown) => {
        if (typeof serviceNameValue === 'string') {
            console.log(serviceNameValue)
            mainServicioSetter(serviceNameValue);
        }
    }

    const setPrice = (eObj: ChangeEvent<HTMLInputElement>) => {
        const newPrice = Number(eObj.target.value);
        if (newPrice >= 0) mainPrecioSetter(newPrice);
        console.log(newPrice)   
    }

    return <>
    <article className={styles['main-frame-container']}>
        <section>
            <h1>{modoInterfaz} servicio</h1>            
        </section>

        <section className={`${styles['modify-servicio-name-container']}`}>
            <label><h2>Nombre/Descripción</h2></label>
            <AutoComplete
                options={listaServicios}
                className={`${styles['autocomplete-limited-container']}`}
                onChange={(eObj) => setName(eObj)}
                >
                <input  
                    className={`${styles['autocomplete-input']}`}
                    placeholder='Escriba el nombre del servicio'
                />
            </AutoComplete>                            
        </section>
        
        <section className={`${styles['modify-servicio-price-container']}`}>
            <label><h2>Precio unitario</h2></label>
            <input 
                placeholder = {(isAgregarMode) ? 'Escriba el precio del servicio' : 'Desabilitado'}
                type='number' 
                min={0}
                onChange={(eObj) => setPrice(eObj)}
                disabled = {!isAgregarMode} //? SÓLO AGREGAR PRECIO SI ES AGREGAR
            />
        </section>

        <div className={`${styles['bottom-buttons-container']}`}>
            <div className={`${styles['mode-buttons-container']}`}>
                <ButtonModeado setNewMode={modoSetter} modoActivo={modoInterfaz} modoObjetivo='AGREGAR'/>
                <ButtonModeado setNewMode={modoSetter} modoActivo={modoInterfaz} modoObjetivo='MODIFICAR'/>
                <ButtonModeado setNewMode={modoSetter} modoActivo={modoInterfaz} modoObjetivo='ELIMINAR'/>
            </div>
            <div className={`${styles['save-service-button-container']}`}>
                <button onClick={() => {enviarDatosServicio(datosServicioEnviar)}}><h4>GUARDAR</h4></button>
            </div>
        </div>
    </article>
    </>
};