import { IServicioBodyRequestFormat } from "models";

export interface IServicioDataAccessObj{
    //* NOMBRE SERVICIO : DATOS DEL SERVICIO
    [key:string] : IServicioData;
}

export interface IServicioIDDataAccessObj{
    //* ID SERVICIO : DATOS DEL SERVICIO
    [key:number] : IServicioData;
}

export interface IServicioIDData {
    //* NOMBRE SERVICIO: ID SERVICIO
    [key:string]: number;
}

export type newTrabajo_prop = 'id' | 'detalle_servicio' | 'equipo' | 'codigo' | 'info_adicional' | 'valor';
export type INewTrabajo = {
    [prop in newTrabajo_prop]: string | number;
}
export interface IServicioData extends IServicioBodyRequestFormat {
    // id: number;
    // detalle_servicio: string;
    // equipo: string;
    // codigo: string;
    // info_adicional: string;
    // valor: number;
    // fecha_realizacion: string;
    created_at: string;
    updated_at: string;
}
