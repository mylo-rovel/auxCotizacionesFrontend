import { FC } from "react";

import styles from "./ModifyServicioFrame.module.css";
import { IModifyServicioFrameProps } from "models";

export const ModifyServicioFrame: FC<IModifyServicioFrameProps> = ({displayFrame}) => {
    const mainContainerClasses = `
    ${styles['modify-servicio-container']} 
    ${(displayFrame) ? '' : styles['modify-servicio-container-hidden'] }`;


    const ModifyServicioInputs: JSX.Element = <>  
        <section className={`${styles['modify-servicio-name-container']}`}>
            <label><h2>Nuevo nombre</h2></label>
            <input id='modify-servicio-name-input' />
        </section>
        
        <section className={`${styles['modify-servicio-price-container']}`}>
            <label><h2>Nuevo precio unitario</h2></label>
            <input type='number' min={0} id='modify-servicio-price-input' />
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