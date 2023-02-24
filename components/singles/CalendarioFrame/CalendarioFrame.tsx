import { FC, useState } from 'react';
import Calendar from 'react-calendar';

import { getValidDateString } from 'utils';
import { ICalendarioFrameProps } from 'models';
import styles from "./CalendarioFrame.module.css";
import { FancyButton, PortalContainer, PortaledModal } from 'components/singles';

export const CalendarFrame: FC<ICalendarioFrameProps> = ({dateSetter, subpageTitle, changeToAnotherSubpage}) => {
    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [fechaElegida, setFechaElegida] = useState<string>('');

    const colorToUse = (subpageTitle === 'fecha de cotización') ? 'green' : 'blue';

    const fechaTitleText = subpageTitle[0].toUpperCase() + subpageTitle.slice(1);

    return (
        <>
            {(displayModal) ? 
            <>
                {/* <PortalContainer>
                    <article className={styles['fecha-elegida-container']}>
                        <h1>{fechaTitleText} elegida</h1>
                        <h1>{fechaElegida}</h1>
                        <section>
                            <FancyButton textToDisplay='CERRAR' onClickFn={() => {
                                setDisplayModal(false);
                                changeToAnotherSubpage();
                            }}/>
                        </section>
                    </article>
                </PortalContainer> */}
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