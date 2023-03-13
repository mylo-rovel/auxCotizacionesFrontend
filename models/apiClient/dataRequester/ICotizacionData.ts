import { IInputClienteDataEnviar } from 'models';

export interface IServicioSolicitado {
    id: number;
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

//* DATOS RECIBIDOS DESDE EL BACKEND --------------------------------
export interface ICotizacion {
    id: number;
    number_id: number;
    fecha: string;
    valido_hasta: string;
    cliente_id: number;
    forma_pago: string;
    anulada: boolean;
    created_at: string;
    updated_at: string;
    servicio_solicitado: ITrabajoSolicitado[];
  }
  
export interface ITrabajoSolicitado {
    id: number;
    cotizacion_id: number;
    servicio_id: number;
    created_at: string;
    updated_at: string;
  }