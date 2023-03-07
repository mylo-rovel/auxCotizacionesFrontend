import { trabajosReducerActions, ITrabajosContextState } from 'models';

export const trabajosReducer = (state: ITrabajosContextState, action: trabajosReducerActions): ITrabajosContextState => {
    //? A COPY OF THE STATE TO NOT CHANGE THE ORIGINAL ONE
    const proxyState = {...state};
    
    switch (action.type) {
        case '[Trabajo] Update-ID':
            if (typeof action.payload_trabajoID !== 'undefined') {            
                proxyState.idTrabajoModificar = action.payload_trabajoID;
            }
            return proxyState;

        case '[Trabajo] Update-Fecha_trabajo':
            if (typeof action.payload_fechaTrabajo !== 'undefined') {            
                proxyState.fechaTrabajoEscogida = action.payload_fechaTrabajo;
            }           
            return proxyState;

        case '[Trabajo] Update-Lista_trabajos':
            if (typeof action.payload_listaTrabajos !== 'undefined') {            
                proxyState.listaTrabajos = action.payload_listaTrabajos;
            }
            return proxyState;

        case '[Trabajo] Update-DisplayCalendar':
            if (typeof action.payload_displayCalendarNewState !== 'undefined') {            
                proxyState.displayCalendar = action.payload_displayCalendarNewState;
            }
            return proxyState;

        default:
            //? THIS WAY THE STATE IS EXACTLY THE SAME. NO CHANGES (EVEN THE REFERENCE IS THE SAME)
            return state;
    }
}