import { ChangeEvent, FC } from "react";

import styles from "./ModifyServicioFrame.module.css";
import { IModifyServicioFrameProps, modoInterfazServicios } from "models";

type setterPropToModify = 'nuevoNombre' | 'nuevoPrecio';

const modoModificar: modoInterfazServicios = "MODIFICAR";
export const ModifyServicioFrame: FC<IModifyServicioFrameProps> = ({modoInterfaz, nombreOriginalModificar, coleccionServicios, nuevoServicioData}) => {

    const modifyNewServData = (eObj: ChangeEvent<HTMLInputElement>, propToModify: setterPropToModify) => {
        const rawNewValue = eObj.target.value;
        if (propToModify === 'nuevoPrecio') {
            const newPrice = Number(rawNewValue)
            if (newPrice >= 0) {
                nuevoServicioData.current['nuevoPrecio'] = newPrice;
            }
            //* NO NEED TO CONTINUE IF WE REACHED THIS POINT
            return;
        }
        nuevoServicioData.current['nuevoNombre'] = rawNewValue;
        return;
    }

    const displayFrame = (
        (modoInterfaz === modoModificar) && 
        (nombreOriginalModificar in coleccionServicios)
    );

    const mainContainerClasses = `
        ${styles['modify-servicio-container']}
        ${(displayFrame) ? '' : styles['modify-servicio-container-hidden'] }`;


    const ModifyServicioInputs: JSX.Element = <>  
        <section className={`${styles['modify-servicio-name-container']}`}>
            <label><h2>Nuevo nombre</h2></label>
            <input 
                onChange={(eObj) => modifyNewServData(eObj, 'nuevoNombre')} 
            />
        </section>
        
        <section className={`${styles['modify-servicio-price-container']}`}>
            <label><h2>Nuevo precio unitario</h2></label>
            <input 
                type='number' 
                min={0} 
                onChange={(eObj) => modifyNewServData(eObj, 'nuevoPrecio')} 
            />
        </section>
    </>;

    const ContentToDisplay = (): JSX.Element => <> {(displayFrame) ? ModifyServicioInputs : null} </>;

    return (
    <>
        <section className={mainContainerClasses}>
            <ContentToDisplay/>
        </section>
    </>
    );
};