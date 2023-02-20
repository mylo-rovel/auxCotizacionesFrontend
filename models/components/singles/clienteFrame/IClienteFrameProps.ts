import { Dispatch, SetStateAction } from "react";

import { IInputClienteDataEnviar } from "models";

export interface IClienteFrameProps {
    clienteDataSetter: Dispatch<SetStateAction<IInputClienteDataEnviar>>
}