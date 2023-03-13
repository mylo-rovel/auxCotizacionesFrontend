import { createContext } from 'react';

import { defaultNUEVA_COTIZACION_ID, defaultTrabajo_INITIAL_ID, getValidDateString } from 'utils';
import { ITrabajosContextState } from 'models';
import { 
    updateIDTrabajoModificar, updateFechaTrabajoEscogida, updateTrabajosList, 
    setDisplayCalendarModal, updatePrevFechaTrabajoEscogida, updateIdCotizacionRecibida
} from './trabajosReducerFns';


//* THIS OBJECT CAN BE USED TO GIVE TYPE TO payload WE WANT TO PASS TO
//* THE REDUCER (AT INTERFACE LEVEL, payload HAS any AS TYPE)
//* WE JUST HAVE TO IMPORT THIS OBJECT IN THE ReducerFns.ts FILE
export const defaultValue: ITrabajosContextState = {
    //* DATA
    idTrabajoModificar: defaultTrabajo_INITIAL_ID,
    fechaTrabajoEscogida: getValidDateString(new Date()),
    prevFechaTrabajoEscogida: '',
    listaTrabajos: [],
    displayCalendar: false,
    nuevaCotizacionID: defaultNUEVA_COTIZACION_ID,

    //* METHODS TO CHANGE DATA (THEY CALL dispatch INTERNALLY)
    updateFechaTrabajoEscogida: updateFechaTrabajoEscogida(null),
    updatePrevFechaTrabajoEscogida: updatePrevFechaTrabajoEscogida(null),
    updateTrabajosList: updateTrabajosList(null),
    updateIDTrabajoModificar: updateIDTrabajoModificar(null),
    updateIdCotizacionRecibida: updateIdCotizacionRecibida(null),

    setDisplayCalendarModal: setDisplayCalendarModal(null),
}
//? The default value argument is ONLY used when a component does not have a matching Provider above in the tree.
//? This default value can be helpful for testing components in isolation without wrapping them

export const TrabajosContext = createContext(defaultValue);