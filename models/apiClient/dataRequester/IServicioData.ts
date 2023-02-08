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