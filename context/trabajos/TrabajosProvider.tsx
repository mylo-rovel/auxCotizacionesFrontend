import { FC, useReducer, PropsWithChildren } from 'react';

import { ITrabajosContextState } from 'models';
import { TrabajosContext, trabajosReducer } from '.';
import { defaultTrabajo_INITIAL_ID, getValidDateString } from 'utils';
import { setDisplayCalendarModal, updateFechaTrabajoEscogida, updateIDTrabajoModificar, updateTrabajosList } from './trabajosReducerFns';

const entriesInitialState: ITrabajosContextState = {
    //* DATA
    idTrabajoModificar: defaultTrabajo_INITIAL_ID,
    fechaTrabajoEscogida: getValidDateString(new Date()),
    listaTrabajos: [],
    displayCalendar: false,

    //* METHODS TO CHANGE DATA (THEY CALL dispatch INTERNALLY)
    updateFechaTrabajoEscogida: updateFechaTrabajoEscogida(null),
    updateTrabajosList: updateTrabajosList(null),
    updateIDTrabajoModificar: updateIDTrabajoModificar(null),

    setDisplayCalendarModal: setDisplayCalendarModal(null),
}

export const TrabajosProvider:FC<PropsWithChildren> = ({children}) => {
    const [state, dispatch] = useReducer(trabajosReducer, entriesInitialState);


    const providerStateToUse: ITrabajosContextState = {
        //* DATA
            ...state,

        //* METHODS TO FIX USING THE dispatch ARGUMENT
        //* REMIND THAT ALL REDUCER FUNCTIONS ARE HIGH ORDER FUNCTIONS
        //*  ==> THAT MEANS WE HAVE TO CALL IT TWICE
        //*  ------> THE FIRST TIME IS WHEN WE PASS THE dispatch FUNCTION
        //*  ------> THE SECOND TIME IS WHEN WE USE IT NORMALLY
        
        //* HERE PUT THE FUNCTIONS THAT DISPATCH WITH dispatch AS ARGUMENT
        updateFechaTrabajoEscogida: updateFechaTrabajoEscogida(dispatch),
        updateTrabajosList: updateTrabajosList(dispatch),
        updateIDTrabajoModificar: updateIDTrabajoModificar(dispatch),

        setDisplayCalendarModal: setDisplayCalendarModal(dispatch),
    }
    return (
        <TrabajosContext.Provider value={providerStateToUse}>
                {children}
        </TrabajosContext.Provider>
    )
}