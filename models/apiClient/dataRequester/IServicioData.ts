export interface IServicioDataAccessObj{
    //* NOMBRE SERVICIO : DATOS DEL SERVICIO
    [key:string] : IServicioData;
}

export interface IServicioIDDataAccessObj{
    //* ID SERVICIO : DATOS DEL SERVICIO
    [key:number] : IServicioData;
}

export interface IServicioData {
    id: number;
    descripcion: string;
    valor_unitario: number;
    created_at: string;
    updated_at: string;
}

export interface IServicioIDData {
    // nombreServicio: idServicio
    [key:string]: number;
}