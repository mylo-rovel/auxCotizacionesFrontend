import { FC } from 'react';
import Calendar from 'react-calendar';

import { ICalendarioFrameProps } from 'models';
import styles from "./CalendarioFrame.module.css";

export const CalendarFrame: FC<ICalendarioFrameProps> = ({dateSetter}) => {
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