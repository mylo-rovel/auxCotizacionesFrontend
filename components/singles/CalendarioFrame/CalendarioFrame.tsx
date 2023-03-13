import Calendar from 'react-calendar';
import { FC, useContext, useState, useEffect } from 'react';

import { ICalendarioFrameProps } from 'models';
import styles from "./CalendarioFrame.module.css";
import { TrabajosContext } from "context/trabajos";
import { PortaledModal } from 'components/singles';
import { getValidDateString, defaultNUEVA_COTIZACION_ID } from 'utils';

export const CalendarFrame: FC<ICalendarioFrameProps> = (props) => {
    const { updateIdCotizacionRecibida } = useContext(TrabajosContext);
    const {
        dateSetter, subpageTitle, changeToAnotherSubpage, resetCotizacionValues
    } = props;
    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [fechaElegida, setFechaElegida] = useState<string>('');

    useEffect(() => {
        updateIdCotizacionRecibida(defaultNUEVA_COTIZACION_ID);
        resetCotizacionValues();
    },[]);

    const colorToUse = (subpageTitle === 'fecha de cotización') ? 'green' : 'blue';
    const fechaTitleText = subpageTitle[0].toUpperCase() + subpageTitle.slice(1);

    return (
        <>
            {(displayModal) ? 
            <>
                <PortaledModal 
                    buttonText='CERRAR' 
                    buttonFn={() => {
                            setDisplayModal(false);
                            changeToAnotherSubpage();
                    }}>
                    <h1>{fechaTitleText} elegida</h1>
                    <h1>{fechaElegida}</h1>
                </PortaledModal>
            </> : null}
            <article className={styles['calendar-frame-title-container']}>
                <h2>Elegir</h2>
                <h2 style={{color:colorToUse, fontSize:'1.75rem'}} >{subpageTitle.toUpperCase()}</h2>
            </article>
            <div className={styles['calendar-frame']}>
                <Calendar 
                        showFixedNumberOfWeeks = {false}
                        showNeighboringMonth = {false}
                        locale='es'
                        onClickDay={(newDate) => {
                            setDisplayModal(true);
                            setFechaElegida(getValidDateString(newDate));
                            dateSetter(newDate)
                        }}
                />
            </div>        
        </>
    )
}