import { Dispatch, SetStateAction } from 'react';

import { getFixedDateSetter } from 'utils';
import styles from "./registrar_servicios.module.css";
import { CalendarFrame, ClienteFrame, ServiciosSolicitadosFrame } from 'components/singles';
import { IInputClienteDataEnviar, IServicioSolicitado, IValoresExtraCotizacion } from 'models';


export function handleIndexChange(prevState:number, variation:number, maxIndex:number) {
    const newState = prevState + variation;
    if ((newState > maxIndex) || (newState < 0)) return prevState;
    return newState;
}


// ? THIS IS THE COLLECTION OF SETTERS WE GET FROM React.useState()
type settersArrTypes = [
    pageIndex: number,
    pageIndexSetter: Dispatch<SetStateAction<number>>,
    
    innerCotiValExtaSetter: Dispatch<SetStateAction<IValoresExtraCotizacion>>,
    setClienteData: Dispatch<SetStateAction<IInputClienteDataEnviar>>,
    setServSolicitadosArr: Dispatch<SetStateAction<IServicioSolicitado[]>>,

    cotiValoresExtra: IValoresExtraCotizacion,
    clienteData: IInputClienteDataEnviar,
    serviciosSolicitadosArr: IServicioSolicitado[]
]


interface IPageOptions {[key:number]: JSX.Element}

export function getPageContent(settersArr: settersArrTypes): JSX.Element {    
    const pageIndex = settersArr[0];
    const pageIndexSetter = settersArr[1];

    const innerCotiValExtaSetter = settersArr[2];
    const innerClienteDataSetter = settersArr[3];
    const innerServSolicitadosArrSetter = settersArr[4];

    const innerCotiValoresExtra = settersArr[5];
    const innerClienteData = settersArr[6];
    const innerServiciosSolicitadosArr = settersArr[7];

    //? BUSCAMOS GUARDAR LA FECHA SELECCIONADA, Y DEJAR EL INDICE EN 1 
    //? PARA "PASAR A LA SIG SUBPÁGINA"
    const dateSetter = getFixedDateSetter(innerCotiValExtaSetter, pageIndexSetter);


    const pageOptions: IPageOptions = {
        0: <CalendarFrame dateSetter={dateSetter}/>,
        1: <ClienteFrame clienteDataSetter={innerClienteDataSetter}/>,
        2: <ServiciosSolicitadosFrame parentServiciosSolicitadosArr={innerServiciosSolicitadosArr} parentServSolicitadosArrSetter={innerServSolicitadosArrSetter}/>
    }

    const selectedContent = pageOptions[pageIndex];
    if (!selectedContent) {
        return  <h1 className={styles['contenido-no-encontrado']}>
                    ERROR EN LA OBTENCIÓN DE CONTENIDO
                </h1>
    }
    return selectedContent;
}


