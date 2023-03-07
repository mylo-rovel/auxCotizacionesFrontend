import { DataRequester } from "apiClient";

import { 
    IServicioDataToSend,
    ICotizacionEnviar, IServicioSolicitado, IInputClienteDataEnviar,
    IValoresExtraCotizacion, IServicioData, INewTrabajo, IServicioBodyRequestFormat, ITrabajoEliminar
} from "models";
import { Dispatch, SetStateAction } from "react";
import { maximumLenghts } from "utils";


const obtenerObjetoTrabajoBienTipado = (newTrabajo: INewTrabajo, fecha_realizacion: string): IServicioBodyRequestFormat => {
    return {
        id:                 Number(newTrabajo.id),
        detalle_servicio:   String(newTrabajo.detalle_servicio),
        equipo:             String(newTrabajo.equipo),
        codigo:             String(newTrabajo.codigo),
        info_adicional:     String(newTrabajo.info_adicional),
        valor:              Number(newTrabajo.valor),
        fecha_realizacion
    };
};
const checkIfNewTrabajo_IS_VALID = (newTrabajo: INewTrabajo) => {
    //* CHECK ID:
    //* VALID VALUES: [-1, 1, 2, 3, 4, ...] EVERY OTHER NUMBER IS INVALID
    if ((Number(newTrabajo.id) < -1) || (Number(newTrabajo.id) === 0)) {
        console.log(Number(newTrabajo.id));
        return {
            isValid: false,
            message: 'ID DE TRABAJO ERRÓNEA. LLAMAR AL DESARROLLADOR DE LA APP',
        };
    };
    //* CHECK VALOR: WE CAN'T SAVE VERY LARGE NUMBERS
    if (String(newTrabajo.valor).length > maximumLenghts.maxValorLength) {
        return {
            isValid: false,
            message: 'El campo VALOR tiene demasiados dígitos',
        };
    };
    return {
        isValid: true,
        message: '',
    };
};
export const guardarTrabajo = async (dataToSend: IServicioDataToSend) => {
    const { 
        servicioGuardar, fecha_realizacion, 
        setResultadoPeticion, setDisplayResultadoModal, 
        updateIDTrabajoModificar 
    } = dataToSend;

    //* CHEQUEAR SI ALGUNO DE LOS DATOS A ENVIAR SON INVÁLIDOS
    const {isValid, message} = checkIfNewTrabajo_IS_VALID(servicioGuardar)
    if (!isValid){
        setResultadoPeticion(message);
        setDisplayResultadoModal(true);
        return;
    }

    let operationResult = '';
    const fixedServicioGuardar: IServicioBodyRequestFormat = obtenerObjetoTrabajoBienTipado(servicioGuardar, fecha_realizacion);
    //TODO: REMEMBER WE ALREADY CHECKED IF THE ID IS IN THIS COLLECTION => [-1, 1, 2, 3, ...]
    //* IF servicioGuardar.id === -1, THE TRABAJO IS NEW
    if (servicioGuardar.id === -1) {
        operationResult = await DataRequester.agregarServicioNuevo(fixedServicioGuardar);
    }
    //* IF THE ID IS GREATER THAN 0, WE ARE MODIFYING AN OLD TRABAJO
    else {
        operationResult = await DataRequester.modificarServicioGuardado(fixedServicioGuardar);
    }
    setResultadoPeticion(operationResult);
    setDisplayResultadoModal(true);
    updateIDTrabajoModificar(-2);
};


export const eliminarTrabajo = async (dataToSend: ITrabajoEliminar) => {
    const { 
        idTrabajo,
        setResultadoPeticion, setDisplayResultadoModal, 
        updateIDTrabajoModificar 
    } = dataToSend;

    const operationResult = await DataRequester.borrarServicioGuardado(idTrabajo);
    setResultadoPeticion(operationResult);
    setDisplayResultadoModal(true);
    updateIDTrabajoModificar(-2);
};



//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------

export const generateEmptyNewTrabajo = ():INewTrabajo => (
    {
        id: -1,
        detalle_servicio: '',
        equipo: '',
        codigo: '',
        info_adicional: '',
        valor: '',        
    }
)


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

export const getEmptyServicioRealizado = (): IServicioSolicitado => {
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
        
        detalle_servicio: '',
        equipo: '',
        codigo: '',
        info_adicional: '',
        valor: 0,
        fecha_realizacion: '',

        created_at: '',
        updated_at: '',
    }
};
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------
//* --------------------------------------------------------------------------------------





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

interface IEnviarDatosCotizacion {
    ensambledObjToSend: ICotizacionEnviar;
    setResultadoOperacionStr: Dispatch<SetStateAction<string>>;
    setDisplayModal: Dispatch<SetStateAction<boolean>>;
    setOperacionFueExitosa: Dispatch<SetStateAction<boolean>>;
}

export const enviarDatosCotizacion = async (propsObj: IEnviarDatosCotizacion) => {
    const {
        ensambledObjToSend, setResultadoOperacionStr,
        setDisplayModal, setOperacionFueExitosa } = propsObj;

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

    const operationResultStr = await DataRequester.enviarDatosCotizacion(ensambledObjToSend);
    setResultadoOperacionStr(operationResultStr);
    setOperacionFueExitosa(true);
    setDisplayModal(true);
    return operationResultStr;
}