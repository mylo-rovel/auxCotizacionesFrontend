import { IServicioData } from 'models';

type actionOption =
    '[Trabajo] Update-ID'             |
    '[Trabajo] Update-Fecha_trabajo'  |
    '[Trabajo] Update-Lista_trabajos' |
    '[Trabajo] Update-DisplayCalendar'
;

export type trabajosReducerActions = {
    type: actionOption;
    
    //* '[Trabajo] Update-ID'
    payload_trabajoID?: number;

    //* '[Trabajo] Update-Fecha_trabajo'
    payload_fechaTrabajo?: string;

    //* '[Trabajo] Update-Lista_trabajos'
    payload_listaTrabajos?: IServicioData[]; 

    payload_displayCalendarNewState?: boolean;
}