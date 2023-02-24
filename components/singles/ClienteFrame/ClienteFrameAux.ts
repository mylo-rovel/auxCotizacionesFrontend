import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { IInputClienteDataEnviar } from "models";
import { IValoresExtraYCliente } from './ClienteFrame';

//* FUNCION USADA ADENTRO DE update_CotiValoresObj_Value
const innerUpdateObjToSet = (objToUpdate: IValoresExtraYCliente, propToModify: keyof IValoresExtraYCliente, rawNewValue: string) => {
    switch (propToModify) {
        case 'nombre':
            objToUpdate['nombre'] = rawNewValue;
            return;

        case 'email':
            objToUpdate['email'] = rawNewValue;                
            return;

        case 'telefono':
            const newNumbValue = Number(rawNewValue);
            if (newNumbValue > -1) {
                objToUpdate['telefono'] = Number(rawNewValue);
            }
            return;

        case 'direccion':                
            objToUpdate['direccion'] = rawNewValue;
            return;

        case 'contacto':
            objToUpdate['contacto'] = rawNewValue;
            return;

        case 'formaPago':
            objToUpdate['formaPago'] = rawNewValue;
            return;
            
        default:
            return;
    }
}

export const update_CotiValoresObj_Value = (setCotizacionValoresExtra: Dispatch<SetStateAction<IValoresExtraYCliente>>, propToModify: keyof IValoresExtraYCliente) => (eObj: ChangeEvent<HTMLInputElement>) => {
    const rawNewValue = eObj.target.value;
    setCotizacionValoresExtra((prevState) => {
        const updateObj = {...prevState};
        innerUpdateObjToSet(updateObj, propToModify, rawNewValue);
        return {
            ...prevState,
            ...updateObj
        }
    })
};

export const updateCotizacionValoresExtra = (datosCliente: IInputClienteDataEnviar, setCotizacionValoresExtra: Dispatch<SetStateAction<IValoresExtraYCliente>>) => {
    const newObjectoToSet = {
        clienteEsNuevo: false,
        idClienteSiEsViejo: datosCliente.id,
        nombre: datosCliente.nombre,
        rut: datosCliente.rut,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion,
        contacto: datosCliente.contacto,
    }
    setCotizacionValoresExtra((prevState) => ({
        ...prevState,
        ...newObjectoToSet
    }))
}