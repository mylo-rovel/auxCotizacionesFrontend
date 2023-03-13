import { IServicioData } from "models";

export interface ITrabajosContextState {
    //* DATA
    idTrabajoModificar: number;
    listaTrabajos: IServicioData[];
    displayCalendar: boolean;
    fechaTrabajoEscogida: string;
    prevFechaTrabajoEscogida: string;
    nuevaCotizacionID: number;

    
    //* METHODS TO CHANGE DATA (THEY CALL dispatch INTERNALLY)
    updateFechaTrabajoEscogida: (newDateString: string) => void;
    updatePrevFechaTrabajoEscogida: (newDateString: string) => void;

    updateIDTrabajoModificar: (nuevaID: number) => void;
    updateTrabajosList: (trabajosListToSet: IServicioData[]) => void;
    updateIdCotizacionRecibida: (nuevaID: number) => void;
    
    setDisplayCalendarModal: (newState: boolean) => void;
}