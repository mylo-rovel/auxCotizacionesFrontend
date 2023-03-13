import { IServicioData } from 'models';

type actionOption =
    '[Trabajo] Update-ID'                   |
    '[Trabajo] Update-Fecha_trabajo'        |
    '[Trabajo] Update-Lista_trabajos'       |
    '[Trabajo] Update-DisplayCalendar'      |
    '[Trabajo] Update-Prev_fechaTrabajo'    |
    '[Trabajo] Update-CotizacionRecibidaId'
;

export type trabajosReducerActions = {
    type: actionOption;
    
    //* '[Trabajo] Update-ID'
    payload_trabajoID?: number;

    //* '[Trabajo] Update-Fecha_trabajo'
    payload_fechaTrabajo?: string;

    //* '[Trabajo] Update-Lista_trabajos'
    payload_listaTrabajos?: IServicioData[]; 

    //* '[Trabajo] Update-DisplayCalendar'
    payload_displayCalendarNewState?: boolean;

    //* '[Trabajo] Update-Prev_fechaTrabajo'
    payload_prevFechaTrabajo?: string;

    //* '[Trabajo] Update-CotizacionRecibidaId'
    payload_nuevaCotizacionId?: number;
}