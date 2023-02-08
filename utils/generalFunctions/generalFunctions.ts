import { NextRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

import { IServicioData, IServicioIDData } from "models";


export const splitAndJoinStr = (inputStr: string, splitStr: string, joinStr: string) => {
    const splittedStrArr = inputStr.split(splitStr);
    return splittedStrArr.join(joinStr);
}

export const onClickGoToPage = (nextRouter: NextRouter, pagePath: string) => {
    nextRouter.push(pagePath);
    return;
}

export const getFixedDateSetter = (innerDateSetter: Dispatch<SetStateAction<Date>>, pageIndexSetter: Dispatch<SetStateAction<number>>) => {        
    return (newDate: Date) => {
        innerDateSetter(newDate);
        pageIndexSetter(1);
    };
}

export const testIfRutIsValid = (rutStr: string): boolean => {
    const regex = /^[\d]{8}(-)[\dkK]$/;
    // const rutToUse = "12345678-k".toUpperCase();
    const rutToUse = rutStr.toUpperCase();        
    return (regex.test(rutToUse) && (rutToUse.length === 10));
}

export const getServiciosIDCollection = (serviciosDataArr: IServicioData[]) => {
    const objectToReturn: IServicioIDData = {}
    serviciosDataArr.forEach((servicioObj) => {
        objectToReturn[servicioObj.descripcion] = servicioObj.id;
    })
    return objectToReturn;
}