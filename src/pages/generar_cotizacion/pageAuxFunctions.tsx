import { Dispatch, SetStateAction } from 'react';

import { getFixedDateSetter } from 'utils';
import styles from "./registrar_servicios.module.css";
import { ICotizacionEnviar, IInputClienteDataEnviar, IServicioSolicitado, IValoresExtraCotizacion } from 'models';
import { CalendarFrame, ClienteFrame, ResumenCotizacionFrame, ServiciosSolicitadosFrame } from 'components/singles';


export function handleIndexChange(prevState:number, variation:number, maxIndex:number) {
    const newState = prevState + variation;
    if ((newState > maxIndex) || (newState < 0)) return prevState;
    return newState;
}


// ? THIS IS THE COLLECTION OF SETTERS WE GET FROM React.useState()
type pageContentArgsArrTypes = [
    pageIndex: number,
    pageIndexSetter: Dispatch<SetStateAction<number>>,
    
    innerCotiValExtaSetter: Dispatch<SetStateAction<IValoresExtraCotizacion>>,
    setClienteData: Dispatch<SetStateAction<IInputClienteDataEnviar>>,
    setServSolicitadosArr: Dispatch<SetStateAction<IServicioSolicitado[]>>,

    cotiValoresExtra: IValoresExtraCotizacion,
    clienteData: IInputClienteDataEnviar,
    serviciosSolicitadosArr: IServicioSolicitado[],

    ensambledObjectToSend: ICotizacionEnviar,

    resetCotizacionValues: () => void,
]


interface IPageOptions {[key:number]: JSX.Element}

export function getPageContent(pageContentArgsArr: pageContentArgsArrTypes): JSX.Element {    
    const pageIndex = pageContentArgsArr[0];
    const pageIndexSetter = pageContentArgsArr[1];

    const innerCotiValExtaSetter = pageContentArgsArr[2];
    const innerClienteDataSetter = pageContentArgsArr[3];
    const innerServSolicitadosArrSetter = pageContentArgsArr[4];

    const innerCotiValoresExtra = pageContentArgsArr[5];
    const innerClienteData = pageContentArgsArr[6];
    const innerServiciosSolicitadosArr = pageContentArgsArr[7];

    const innerEnsambledObjToSend = pageContentArgsArr[8];

    const resetCotizacionValues = pageContentArgsArr[9];

    //? BUSCAMOS GUARDAR LA FECHA SELECCIONADA, Y DEJAR EL INDICE EN 1 
    //? PARA "PASAR A LA SIG SUBPÁGINA"
    const dateSetterFechaCoti = getFixedDateSetter(innerCotiValExtaSetter, 'fecha de cotización');
    const dateSetterFechaValidezCoti = getFixedDateSetter(innerCotiValExtaSetter, 'fecha de validez de la cotización');

    const changeToNextSubpage = (pageIndexSetter: Dispatch<SetStateAction<number>>, currentSubPage: number) => () => {
        pageIndexSetter(currentSubPage + 1);
    }

    const pageOptions: IPageOptions = {
        0: <CalendarFrame resetCotizacionValues={resetCotizacionValues} changeToAnotherSubpage={changeToNextSubpage(pageIndexSetter, 0)} subpageTitle='fecha de cotización' dateSetter={dateSetterFechaCoti}/>,
        1: <CalendarFrame resetCotizacionValues={resetCotizacionValues} changeToAnotherSubpage={changeToNextSubpage(pageIndexSetter, 1)} subpageTitle='fecha de validez de la cotización' dateSetter={dateSetterFechaValidezCoti}/>,
        2: <ClienteFrame parent_formaPago={innerCotiValoresExtra.formaPago} fechaCotizacion={innerCotiValoresExtra.fechaCotizacion} parent_clienteDataSetter={innerClienteDataSetter} parent_cotiValExtaSetter={innerCotiValExtaSetter} parent_clientData={innerClienteData}/>,
        3: <ServiciosSolicitadosFrame parentServiciosSolicitadosArr={innerServiciosSolicitadosArr} parentServSolicitadosArrSetter={innerServSolicitadosArrSetter}/>,
        4: <ResumenCotizacionFrame ensambledObjToSend={innerEnsambledObjToSend}/>,
    }

    const selectedContent = pageOptions[pageIndex];
    if (!selectedContent) {
        return  <h1 className={styles['contenido-no-encontrado']}>
                    ERROR EN LA OBTENCIÓN DE CONTENIDO
                </h1>
    }
    return selectedContent;
}