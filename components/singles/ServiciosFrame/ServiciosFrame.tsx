import Calendar from 'react-calendar';
import { FC, useContext, useEffect, useState } from 'react';

import { getValidDateString } from 'utils';
import styles from "./ServiciosFrame.module.css";
import { TrabajosContext } from 'context/trabajos';
import { PortaledModal } from 'components/singles';
import { IServiciosFrameProps } from "models";
import { MainServiciosFrame } from "./MainServiciosFrame/MainServiciosFrame";
import { ListaServiciosFrame } from "./ListaServiciosFrame/ListaServiciosFrame";

export const ServiciosFrame: FC<IServiciosFrameProps> = () => {
    const { 
        fechaTrabajoEscogida, updateFechaTrabajoEscogida, 
        displayCalendar, setDisplayCalendarModal,
        updateIDTrabajoModificar
     } = useContext(TrabajosContext);

    const [displayModalResultado, setDisplayModalResultado] = useState<boolean>(false);

    const [resultadoPeticion, setResultadoPeticion] = useState<string>('');
    
    useEffect(() => {
        if (fechaTrabajoEscogida === '') {
            const todayDateObj = new Date();
            updateFechaTrabajoEscogida(getValidDateString(todayDateObj));
        }
        // return () => {
        //     // updateIDTrabajoModificar(-2);
        // }
    }, [fechaTrabajoEscogida]);


    const displayModalResultadoButtonFn = () => { if (document) setDisplayModalResultado(false); }
    const displayModalCalendarioButtonFn = () => { if (document) setDisplayCalendarModal(false); }


    const ModalResultadoOperacion = () => {
        if (!displayModalResultado) return <></>;
        return (
        <>
            <PortaledModal buttonText='CERRAR' buttonFn={displayModalResultadoButtonFn}>
                <h1>{resultadoPeticion}</h1>
            </PortaledModal>
        </>)
    }

    const ModalCalendario = () => {
        if (!displayCalendar) return <></>;
        return (
        <>
            <PortaledModal contentIsNotOnlyText={true} buttonText='CERRAR' buttonFn={displayModalCalendarioButtonFn}>
                <article className={styles['calendar-frame']}>                
                    <Calendar 
                        showFixedNumberOfWeeks = {false}
                        showNeighboringMonth = {false}
                        locale='es'
                        onClickDay={(newDate) => {
                            const dateString = getValidDateString(newDate);
                            // alert(dateString);
                            updateFechaTrabajoEscogida(dateString);
                            setDisplayCalendarModal(false);
                        }}
                    />    
                </article>        
            </PortaledModal>
        </>)
    }


    return <>
        
        <ModalResultadoOperacion/>
        <ModalCalendario/>
        
        <article>
            <section className={styles['servicios-frame-container']}>
                <MainServiciosFrame
                    setDisplayModalResultado={setDisplayModalResultado}
                    setResultadoPeticion={setResultadoPeticion}
                />
                <ListaServiciosFrame
                    setDisplayModalResultado={setDisplayModalResultado}
                    setResultadoPeticion={setResultadoPeticion}
                />
            </section>
        </article>
    </>
};