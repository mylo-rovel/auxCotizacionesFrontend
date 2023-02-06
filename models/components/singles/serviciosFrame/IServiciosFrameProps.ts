import { IServicioData } from "models";

export interface IServiciosFrameProps {
    
}

export interface IModifyServicioFrameProps {
    displayFrame: boolean;
}

export type modoInterfazServicios = 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR';

export interface IMainServiciosFrameProps {
    modoInterfaz: modoInterfazServicios;
    serviciosGuardados: IServicioData[]
}

export interface IListaServGuardadosFrameProps {
    serviciosGuardados: IServicioData[]
}