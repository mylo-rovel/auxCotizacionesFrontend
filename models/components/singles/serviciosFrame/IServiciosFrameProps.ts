import { INewTrabajo } from "models";
import { Dispatch, SetStateAction } from "react";

//* Needed for the main component of the registrar_trabajos page
export interface IServiciosFrameProps {}

//* THIS IS A MainServiciosFrame PROP => THIS IS THE DATA WE WILL SEND TO THE BACKEND
export interface IServicioDataToSend {
    servicioGuardar: INewTrabajo;
    fecha_realizacion: string;

    //! IMPORTANT TO DISPLAY THE RESULT OF THE OPERATION
    setResultadoPeticion: Dispatch<SetStateAction<string>>;
    setDisplayResultadoModal: Dispatch<SetStateAction<boolean>>;

    //* THIS WAY WE CAN "RESET" AND REFETCH THE DATA
    updateIDTrabajoModificar: (nuevaID: number) => void;
}

export interface ITrabajoEliminar {
    idTrabajo: number;

    //! IMPORTANT TO DISPLAY THE RESULT OF THE OPERATION
    setResultadoPeticion: Dispatch<SetStateAction<string>>;
    setDisplayResultadoModal: Dispatch<SetStateAction<boolean>>;

    //* THIS WAY WE CAN REFETCH THE DATA
    updateIDTrabajoModificar: (nuevaID: number) => void;
}

//* -------------------------------------------------------------------
//* -------------------------------------------------------------------
//* EACH FRAME PROPS --------------------------------------------------
//* -------------------------------------------------------------------
//* -------------------------------------------------------------------
export interface IModifyServicioFrameProps {}
export interface IMainServiciosFrameProps {
    //* PARA LA FUNCION DE AGREGAR Y MODIFICAR TRABAJO
    setDisplayModalResultado: Dispatch<SetStateAction<boolean>>
    setResultadoPeticion: Dispatch<SetStateAction<string>>;
}
export interface IListaServGuardadosFrameProps {
    //* PARA LA FUNCION DE ELIMINAR TRABAJO
    setDisplayModalResultado: Dispatch<SetStateAction<boolean>>
    setResultadoPeticion: Dispatch<SetStateAction<string>>;
}
//* -------------------------------------------------------------------
//* -------------------------------------------------------------------
//* -------------------------------------------------------------------




//* -------------------------------------------------------------------
//* -------------------------------------------------------------------
//* OBJECTS WE SEND TO THE BACKEND ------------------------------------
//* -------------------------------------------------------------------
//* -------------------------------------------------------------------
//? IN THE BACKEND WE CHECK THE DATA SO WE MUST FULFILL THE INTERFACES

export interface IServicioBodyRequestFormat { 
    id:                 number;
    detalle_servicio:   string;
    equipo:             string;
    codigo:             string;
    info_adicional:     string;
    valor:              number;
    fecha_realizacion:  string;
}