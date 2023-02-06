import { FC, useEffect } from 'react';
import Calendar from 'react-calendar';

import { DataRequester } from "apiClient"
import { ICalendarioFrameProps } from 'models';
import styles from "./CalendarioFrame.module.css";

export const CalendarFrame: FC<ICalendarioFrameProps> = ({dateSetter}) => {
    useEffect(() => {
        const fetchListaServicios = async () => {
            const aa = DataRequester.getListaServicios();
        }
        fetchListaServicios()
    }, [])

    return (
        <>
            <div className={styles['calendar-frame']}>
            <Calendar 
                    showFixedNumberOfWeeks = {false}
                    showNeighboringMonth = {false}
                    locale='es'
                    onClickDay={(newDate) => dateSetter(newDate)}
            />
            </div>        
        </>
    )
}