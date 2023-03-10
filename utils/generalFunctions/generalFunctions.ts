import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

import { maximumLenghts, monthsByNumber } from 'utils';
import { IServicioData, IServicioIDData, IValoresExtraCotizacion, calendarFrameToUse } from "models";


export const splitAndJoinStr = (inputStr: string, splitStr: string, joinStr: string) => {
    const splittedStrArr = inputStr.split(splitStr);
    return splittedStrArr.join(joinStr);
}

export const onClickGoToPage = (nextRouter: NextRouter, pagePath: string) => {
    nextRouter.push(pagePath);
    return;
}

const get2DigitsNumberString = (inputNumb: number) => {
    const strInput = `${inputNumb}`
    if (strInput.length >= 2) return strInput;    
    return "0"+strInput;
}

export const getValidDateString = (dateObj: Date) => {
    const dateDay = get2DigitsNumberString(dateObj.getDate());
    const dateMonth = get2DigitsNumberString(dateObj.getMonth()+1);
    const dateYear = dateObj.getFullYear();
    
    return `${dateDay}-${dateMonth}-${dateYear}`;
}

export const getFixedDateSetter = (innerCotiValExtaSetter: Dispatch<SetStateAction<IValoresExtraCotizacion>>, frameToUse: calendarFrameToUse) => {        
    return (newDate: Date) => {
        if (frameToUse === 'fecha de cotización') {
            innerCotiValExtaSetter((prevState) => {
                return {
                    ...prevState,
                    fechaCotizacion: getValidDateString(newDate)
                }
            })            
            return;
        }
        if (frameToUse === 'fecha de validez de la cotización') {
            innerCotiValExtaSetter((prevState) => {
                return {
                    ...prevState,                    
                    fechaValidezCoti: getValidDateString(newDate)
                }
            })
            return;
        }
    };
}

export const testIfRutIsValid = (rutStr: string): boolean => {
    const regex = /^[\d]{8}(-)[\dkK]$/;
    const rutToUse = rutStr.toUpperCase();        
    return (regex.test(rutToUse) && (rutToUse.length === maximumLenghts.maxRutLength));
}


export const getServiciosIDCollection = (serviciosDataArr: IServicioData[]): IServicioIDData => {
    const objectToReturn: IServicioIDData = {}
    serviciosDataArr.forEach((servicioObj) => {
        objectToReturn[servicioObj.detalle_servicio] = servicioObj.id;
    })
    return objectToReturn;
}

interface modifyArrProps {
    mode: 'add'|'remove';
    arrToModify: unknown[];
    indexToUse: number;
    elementToAdd? : unknown
}

export const modifyArr = (props: modifyArrProps) => {
    const {mode, arrToModify, indexToUse, elementToAdd} = props;
    //* SPLITTING THE ARRAY OF SERVICIOS
    let solicitudesArrLeft = arrToModify.slice(0, indexToUse);
    const solicitudesArrRight = arrToModify.slice(indexToUse, arrToModify.length);
    if (mode === 'add') {
        solicitudesArrLeft.push(elementToAdd);
    }
    else {
        solicitudesArrLeft.pop()
    };

    return solicitudesArrLeft.concat(solicitudesArrRight);
}


export const getAcceptableStringValue = (valueToCheck: string | number): string => {
    return (String(valueToCheck).length === 0) ? ' - ' : String(valueToCheck)
}

export const getFechaBonitaParaMostrar = (fechaTrabajoEscogida: string): string => {
    const fechaArr = fechaTrabajoEscogida.split('-').map((item) => Number(item));
    if (!monthsByNumber[fechaArr[1]]) return fechaTrabajoEscogida;
    return `${fechaArr[0]} de ${monthsByNumber[fechaArr[1]]} de ${fechaArr[2]}`;
}


    // // * FUNCION QUE SE EJECUTA EN EL BOTON (+)
    // const addNewNextServicioSolicitado = (rowIndex: number) => () => {
    //     if (rowIndex < 0) return;
    //     // const newArray = modifyArr({
    //     //     mode: 'add',
    //     //     arrToModify: listaServiciosSolicitados,
    //     //     indexToUse: rowIndex + 1,
    //     //     elementToAdd: getEmptyServicioSolicitado()
    //     // }) as IServicioSolicitado[];
    //     // setListaSolicitados(newArray);

    //     listaServiciosSolicitados.push(getEmptyServicioSolicitado());
    //     const proxyListaSolicitados = [...listaServiciosSolicitados];
    //     setListaSolicitados(proxyListaSolicitados);
    //     parentServSolicitadosArrSetter(proxyListaSolicitados);
    // }

    // // * FUNCION QUE SE EJECUTA EN EL BOTON (-)
    // const removeCurrentServicioSolicitado = (rowIndex: number) => () => {
    //     if (rowIndex < 0) return;
    //     // const newArray = modifyArr({
    //     //     mode: 'remove',
    //     //     arrToModify: listaServiciosSolicitados,
    //     //     indexToUse: rowIndex + 1,
    //     // }) as IServicioSolicitado[];
    //     // setListaSolicitados(newArray);

    //     listaServiciosSolicitados.pop();
    //     const proxyListaSolicitados = [...listaServiciosSolicitados];
    //     setListaSolicitados(proxyListaSolicitados);
    //     parentServSolicitadosArrSetter(proxyListaSolicitados);
    // }