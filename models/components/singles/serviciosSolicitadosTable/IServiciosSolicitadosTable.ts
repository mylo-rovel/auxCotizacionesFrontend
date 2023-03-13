import { IServicioIDDataAccessObj, IServicioSolicitado } from "models";

export interface IServiciosSolicitadosTableProps {
    serviciosSolicitadosArr: IServicioSolicitado[];
    dict_IdTrabajo_DatosTrabajo: IServicioIDDataAccessObj;
}