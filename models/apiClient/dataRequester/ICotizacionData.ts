import { IInputClienteDataEnviar } from 'models';

export interface IServicioSolicitado {
    id: number;
    cantidad: number;
    codigo: string;
}

export interface IValoresExtraCotizacion {
    fechaCotizacion: string;
    fechaValidezCoti: string;
    clienteEsNuevo: boolean;
    idClienteSiEsViejo: number;
    formaPago: string;
}

export interface ICotizacionEnviar extends IValoresExtraCotizacion{
    clienteData: IInputClienteDataEnviar;
    serviciosSolicitados: IServicioSolicitado[];
}