import { IServicioSolicitado } from "models";
import { Dispatch, SetStateAction } from "react";

export interface IServiciosSolicitadosFrameProps {
    parentServSolicitadosArrSetter: Dispatch<SetStateAction<IServicioSolicitado[]>>;
    parentServiciosSolicitadosArr: IServicioSolicitado[];
}