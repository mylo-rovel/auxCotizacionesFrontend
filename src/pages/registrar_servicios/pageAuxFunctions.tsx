import { Dispatch, SetStateAction } from 'react';

import { getFixedDateSetter } from 'utils';
import styles from "./registrar_servicios.module.css";
import { CalendarFrame, ConfiguracionFrame } from 'components/singles';


export function handleIndexChange(prevState:number, variation:number, maxIndex:number) {
    const newState = prevState + variation;
    if ((newState > maxIndex) || (newState < 0)) return prevState;
    return newState;
}




// ? THIS IS THE COLLECTION OF SETTERS WE GET FROM React.useState()
type settersArrTypes = [
    pageIndex: number,
    innerDateSetter: Dispatch<SetStateAction<Date>>,     
    pageIndexSetter: Dispatch<SetStateAction<number>>
]

interface IPageOptions {[key:number]: JSX.Element}

export function getPageContent(settersArr: settersArrTypes): JSX.Element {    
    const pageIndex = settersArr[0];
    const innerDateSetter = settersArr[1];
    const pageIndexSetter = settersArr[2];

    //? BUSCAMOS GUARDAR LA FECHA GUARDADA, Y DEJAR EL INDICE EN 1 
    //? PARA "PASAR A LA SIG SUBPÁGINA"
    const dateSetter = getFixedDateSetter(innerDateSetter, pageIndexSetter);

    const pageOptions: IPageOptions = {
        0: <CalendarFrame dateSetter={dateSetter}/>,
        1: <></>
    }

    const selectedContent = pageOptions[pageIndex];
    if (!selectedContent) {
        return  <h1 className={styles['contenido-no-encontrado']}>
                    ERROR EN LA OBTENCIÓN DE CONTENIDO
                </h1>
    }
    return selectedContent;
}