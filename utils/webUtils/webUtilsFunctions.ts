import { DataRequester } from "apiClient";

import { 
    IServicioBodyRequestFormat, IModificarServicioDataEnviar, IServicioDataToSend,
    ICotizacionEnviar, IServicioSolicitado, IInputClienteDataEnviar,
    IValoresExtraCotizacion, IServicioData
} from "models";
import { Dispatch, SetStateAction } from "react";
import { maximumLenghts } from "utils";

export const enviarDatosServicio = async (dataToSend: IServicioDataToSend) => {
    const {
        coleccionServicios, modoInterfaz, servicioBuscado, precioServicio, 
        servicioModificadoData, setResultadoPeticion, setDisplayModal} = dataToSend;
    let resultadoPeticion = '';

    const reqBodyToSend: IServicioBodyRequestFormat = {
        descripcion: servicioBuscado,
        valor_unitario: precioServicio
    }

    switch (modoInterfaz) {
        case "AGREGAR":
            //? CHEQUEAR SI ALGUNO DE LOS DATOS A ENVIAR SON INVÁLIDOS
            if ((servicioBuscado === '') || (precioServicio < 1) || (`${precioServicio}`.length > 9 )){
                console.log("Error. AGREGAR", servicioBuscado, precioServicio);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS PARA AGREGAR EL SERVICIO');
                setDisplayModal(true);
            }
            else {
                const {operationResultStr} = await DataRequester.agregarServicioNuevo(reqBodyToSend);
                setResultadoPeticion(operationResultStr);
                setDisplayModal(true);
            }
            return;
        //* --------------------------------------------------------
        case "MODIFICAR":
            //? CHEQUEAR SI ALGUNO DE LOS DATOS A ENVIAR SON INVÁLIDOS
            if (!(servicioBuscado in coleccionServicios) || (`${servicioModificadoData.nuevoPrecio}`.length > 9 )){
                console.log("Error. MODIFICAR", servicioBuscado, coleccionServicios);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS PARA MODIFICAR EL SERVICIO');
                setDisplayModal(true);
            }
            else {
                const rebBodyToSend_Modify: IModificarServicioDataEnviar = {
                    old_servicio: {
                        descripcion: servicioBuscado,
                        valor_unitario: precioServicio,
                    },
                    new_servicio: {
                        descripcion: (servicioModificadoData.nuevoNombre === '') ? servicioBuscado : servicioModificadoData.nuevoNombre,
                        valor_unitario: (servicioModificadoData.nuevoPrecio === 0) ? precioServicio : servicioModificadoData.nuevoPrecio
                    }
                }
    
                const {operationResultStr} = await DataRequester.modificarServicioGuardado(rebBodyToSend_Modify);
                setResultadoPeticion(operationResultStr);
                setDisplayModal(true);
            }
            return;
        
        case "ELIMINAR":
            //? CHEQUEAR SI ALGUNO DE LOS DATOS A ENVIAR SON INVÁLIDOS
            if (!(servicioBuscado in coleccionServicios)){
                console.log("Error. ELIMINAR", servicioBuscado, coleccionServicios);
                console.log(servicioBuscado, coleccionServicios);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS PARA ELIMINAR EL SERVICIO');
                setDisplayModal(true);
            }
            else {
                const {operationResultStr} = await DataRequester.borrarServicioGuardado(reqBodyToSend);
                setResultadoPeticion(operationResultStr);
                setDisplayModal(true);
            }
            return;

        default:
            alert("MODO NO VÁLIDO")
            resultadoPeticion = 'ERROR. MODO NO VÁLIDO'
            setResultadoPeticion(resultadoPeticion);
            setDisplayModal(true);
            return;
    }
};

export const getEnsambledCotizacionEnviar = (
    valoresExtra: IValoresExtraCotizacion,
    clienteData: IInputClienteDataEnviar,
    serviciosSolicitados: IServicioSolicitado[]): ICotizacionEnviar => {

    return {
        fechaCotizacion: valoresExtra.fechaCotizacion,
        fechaValidezCoti: valoresExtra.fechaValidezCoti,
        clienteEsNuevo: valoresExtra.clienteEsNuevo,
        idClienteSiEsViejo: valoresExtra.idClienteSiEsViejo,
        formaPago: valoresExtra.formaPago,
                
        clienteData,
        serviciosSolicitados
    }
};

export const getEmptyCotiValoresExtra = (): IValoresExtraCotizacion => {
    return {
        fechaCotizacion: '',
        fechaValidezCoti: '',
        clienteEsNuevo: true,
        idClienteSiEsViejo: 1,
        formaPago: '',
    }
};

export const getEmptyClienteData = (): IInputClienteDataEnviar => {
    return {
        id: 0,
        nombre: '',
        rut: '',
        email: '',
        telefono: 0,
        direccion: '',
        contacto: '',
        created_at: '',
        updated_at: '',
    }
};

export const getEmptyServicioSolicitado = (): IServicioSolicitado => {
    return {
        id: -1,
        cantidad: 0,
        codigo: '',
    }
};

export const getDummyServicioSolicitadoArr = (arrLength: number): IServicioSolicitado[] => {
    const opcionesID = [31, 19, 28, 16, 30, 29, 20];
    return new Array(arrLength).fill(0).map((_, index) => {
        const dummyObj = getEmptyServicioSolicitado();
        const indexToUse = Math.min(index, opcionesID.length);
        dummyObj.id = opcionesID[indexToUse];
        dummyObj.cantidad = indexToUse;
        return dummyObj;
    });
};

export const getEmptyServicioDataObj = (): IServicioData => {
    return {
        id: -1,
        descripcion: '',
        valor_unitario: 0,
        created_at: '',
        updated_at: '',
    }
};


//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------

const checkClienteData = (clienteData: IInputClienteDataEnviar, formaPago: string): boolean => {
    //* TELEFONO NO MUY LARGO
    if (`${clienteData.telefono}`.length > 9) return false;
    
    //* EMAIL CORRECTO
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!(regex.test(clienteData.rut))) return false;

    return (
        (clienteData.nombre !== '') &&
        (clienteData.rut !== '') &&
        (clienteData.email !== '') &&
        (clienteData.telefono > 0) &&
        (clienteData.direccion !== '') &&
        (formaPago !== '')
    );
}

const checkServiciosSolicitados = (serviciosSolicitados: IServicioSolicitado[]): boolean => {
    return (
        serviciosSolicitados.every((servicioItem) => {
            const id = servicioItem.id;
            const codigo = servicioItem.codigo;
            const cantidad = servicioItem.cantidad;
            return (
                (id > -1) &&
                (codigo !== '') &&
                (cantidad > 0)
            )
        })
    );
}

export const enviarDatosCotizacion = async (ensambledObjToSend: ICotizacionEnviar, setResultadoOperacionStr: Dispatch<SetStateAction<string>>, setDisplayModal: Dispatch<SetStateAction<boolean>>, setOperacionFueExitosa: Dispatch<SetStateAction<boolean>>) => {
    // const clienteDataIsValid = checkClienteData(clienteData, formaPago);
    // const serviciosSolicitadosAreValid = checkServiciosSolicitados(serviciosSolicitados);
    // const dataEnviarAreValid = clienteDataIsValid && serviciosSolicitadosAreValid;
    const {formaPago, clienteData, serviciosSolicitados} = ensambledObjToSend;

    const clienteDataIsValid = (
        (clienteData.nombre !== '') &&
        (clienteData.rut !== '') &&
        (clienteData.email !== '') &&
        (clienteData.telefono > 0) &&
        (clienteData.direccion !== '') &&
        (formaPago !== '')
    );
    if (!(clienteDataIsValid)) {
        setResultadoOperacionStr('ERROR. ALGUNOS VALORES DEL CLIENTE ESTÁN VACÍOS');
        setOperacionFueExitosa(false);
        setDisplayModal(true);
        return 'ERROR. ALGUNOS VALORES DEL CLIENTE ESTÁN VACÍOS';
    }

    //* CHEQUEAR QUE EL TELEFONO NO ES MUY LARGO
    if (`${clienteData.telefono}`.length > maximumLenghts.maxTelefonoLength) {
        setResultadoOperacionStr('ERROR. VALOR TELEFONO MUY LARGO');
        setOperacionFueExitosa(false);
        setDisplayModal(true);
        return 'ERROR. VALOR TELEFONO MUY LARGO';
    }
    //* --------------------------------------------------------------------------------


    //* CHEQUEAR QUE EL EMAIL ES CORRECTO
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!(regex.test(clienteData.email))) {
        setResultadoOperacionStr('ERROR. EMAIL INVÁLIDO');
        setOperacionFueExitosa(false);
        setDisplayModal(true);
        return 'ERROR. EMAIL INVÁLIDO';
    }
    //* --------------------------------------------------------------------------------


    //* CHEQUEAR QUE NO HAY FILAS DE SERVICIOS VACIAS
    const allServiciosAreValid = serviciosSolicitados.every((servicioItem) => {
        const id = servicioItem.id;
        const codigo = servicioItem.codigo;
        const cantidad = servicioItem.cantidad;
        return ((id > -1) && (codigo !== '') && (cantidad > 0))
    })
    if (!allServiciosAreValid) {
        setResultadoOperacionStr('ERROR. FILAS DE SERVICIOS SOLICITADOS VACÍAS');
        setOperacionFueExitosa(false);
        setDisplayModal(true);
        return 'ERROR. FILAS DE SERVICIOS SOLICITADOS VACÍAS';
    }
    //* --------------------------------------------------------------------------------

    const {operationResultStr, operationWasSuccess} = await DataRequester.enviarDatosCotizacion(ensambledObjToSend);
    setResultadoOperacionStr(operationResultStr);
    setOperacionFueExitosa(operationWasSuccess);
    setDisplayModal(true);
    return operationResultStr;
}