import { IServicioIDDataAccessObj, IServicioSolicitado } from "models";

export interface IServiciosSolicitadosTableProps {
    serviciosSolicitadosArr: IServicioSolicitado[];
    coleccionServiciosPorID: IServicioIDDataAccessObj;
}