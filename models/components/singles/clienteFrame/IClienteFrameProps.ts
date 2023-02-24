import { Dispatch, SetStateAction } from "react";

import { IInputClienteDataEnviar, IValoresExtraCotizacion } from "models";

export interface IClienteFrameProps {
    parent_clienteDataSetter: Dispatch<SetStateAction<IInputClienteDataEnviar>>;
    parent_cotiValExtaSetter: Dispatch<SetStateAction<IValoresExtraCotizacion>>;
    parent_clientData: IInputClienteDataEnviar;
    fechaCotizacion: string;
    parent_formaPago: string;
}