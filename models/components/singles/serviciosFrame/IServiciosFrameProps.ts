import { Dispatch, MutableRefObject, SetStateAction } from "react";

import { IServicioData, IServicioIDData } from "models";

export interface IServiciosFrameProps {
    
}

//* THIS GOES TO MainServiciosFrame
export interface IServicioDataToSend {
    coleccionServicios : IServicioIDData;
    modoInterfaz : modoInterfazServicios;
    servicioBuscado : string;
    precioServicio: number;
    servicioModificadoData : IServicioModificadoData;

    setResultadoPeticion: Dispatch<SetStateAction<string>>;
    setDisplayModal: Dispatch<SetStateAction<boolean>>;
}

//* THIS GOES TO ModifyServicioFrame
export interface IServicioModificadoData {
    nuevoNombre: string;
    nuevoPrecio: number;
}

export interface IModifyServicioFrameProps {
    modoInterfaz: modoInterfazServicios;
    coleccionServicios: IServicioIDData;
    nombreOriginalModificar: string;
    nuevoServicioData: MutableRefObject<IServicioModificadoData>;
}

export type modoInterfazServicios = 'AGREGAR' | 'MODIFICAR' | 'ELIMINAR';

export interface IMainServiciosFrameProps {
    serviciosGuardados: IServicioData[];

    modoInterfaz: modoInterfazServicios;
    mainServicioSetter: Dispatch<SetStateAction<string>>;
    mainPrecioSetter: Dispatch<SetStateAction<number>>
    modoSetter: Dispatch<SetStateAction<modoInterfazServicios>>;
    datosServicioEnviar: IServicioDataToSend;
}

export interface IListaServGuardadosFrameProps {
    serviciosGuardados: IServicioData[];
}


//? IN THE BACKEND WE CHECK THE DATA SO WE MUST FULFILL THE INTERFACES

export interface IServicioBodyRequestFormat { 
    descripcion: string;
    valor_unitario: number;
}

export interface IModificarServicioDataEnviar { 
    old_servicio: IServicioBodyRequestFormat;
    new_servicio: IServicioBodyRequestFormat;
}
