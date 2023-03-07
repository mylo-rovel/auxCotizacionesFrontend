import { IServicioData } from "models";

export interface ITrabajosContextState {
    //* DATA
    idTrabajoModificar: number;
    fechaTrabajoEscogida: string;
    listaTrabajos: IServicioData[];
    displayCalendar: boolean;
    
    //* METHODS TO CHANGE DATA (THEY CALL dispatch INTERNALLY)
    updateFechaTrabajoEscogida: (newDateString: string) => void;

    updateIDTrabajoModificar: (nuevaID: number) => void;
    updateTrabajosList: (trabajosListToSet: IServicioData[]) => void;
    
    setDisplayCalendarModal: (newState: boolean) => void;
}