import { Dispatch } from 'react';

import { IServicioData, trabajosReducerActions } from 'models';

//* ESTA FUNCIONES LLAMAN dispatch DE FORMA INTERNA 
//* NO SON LOS REDUCER EN SÍ, PERO NOS MANDAN A ELLOS 

export const updateIDTrabajoModificar = (dispatch: Dispatch<trabajosReducerActions> | null = null) => (newID: number) => {
    //* DE ESTA FORMA, PODEMOS PONER ESTA FUNCION SIN DISPATCH EN EL 
    //* OBJETO ESTADO INICIAL O ESTADO POR DEFECTO
    if (dispatch === null) return;

    const dispatchArg: trabajosReducerActions = {
        type: '[Trabajo] Update-ID',
        payload_trabajoID: newID
    }
    dispatch(dispatchArg);
}

export const updateFechaTrabajoEscogida = (dispatch: Dispatch<trabajosReducerActions> | null = null) => (newDateString: string) => {
    //* DE ESTA FORMA, PODEMOS PONER ESTA FUNCION SIN DISPATCH EN EL 
    //* OBJETO ESTADO INICIAL O ESTADO POR DEFECTO
    if (dispatch === null) return;

    const dispatchArg: trabajosReducerActions = {
        type: '[Trabajo] Update-Fecha_trabajo',
        payload_fechaTrabajo: newDateString
    }
    dispatch(dispatchArg);
}

export const updateTrabajosList = (dispatch: Dispatch<trabajosReducerActions> | null = null) => (trabajosListToSet: IServicioData[]) => {
    //* DE ESTA FORMA, PODEMOS PONER ESTA FUNCION SIN DISPATCH EN EL 
    //* OBJETO ESTADO INICIAL O ESTADO POR DEFECTO
    if (dispatch === null) return;

    const dispatchArg: trabajosReducerActions = {
        type: '[Trabajo] Update-Lista_trabajos',
        payload_listaTrabajos: trabajosListToSet
    }
    dispatch(dispatchArg);
}

export const setDisplayCalendarModal = (dispatch: Dispatch<trabajosReducerActions> | null = null) => (newState: boolean) => {
    //* DE ESTA FORMA, PODEMOS PONER ESTA FUNCION SIN DISPATCH EN EL 
    //* OBJETO ESTADO INICIAL O ESTADO POR DEFECTO
    if (dispatch === null) return;

    const dispatchArg: trabajosReducerActions = {
        type: '[Trabajo] Update-DisplayCalendar',
        payload_displayCalendarNewState: newState
    }
    dispatch(dispatchArg);
}