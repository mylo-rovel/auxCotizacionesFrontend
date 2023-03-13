import { DataRequester } from "apiClient";

import { 
    IServicioDataToSend,
    ICotizacionEnviar, IServicioSolicitado, IInputClienteDataEnviar,
    IValoresExtraCotizacion, IServicioData, INewTrabajo, IServicioBodyRequestFormat, ITrabajoEliminar
} from "models";
import { Dispatch, SetStateAction } from "react";
import { maximumLenghts, testIfRutIsValid } from "utils";


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
    }
};

export const getEmptyServicioRealizado = (): IServicioSolicitado => {
    return {
        id: -1,
    }
};

export const getDummyServicioSolicitadoArr = (arrLength: number): IServicioSolicitado[] => {
    const opcionesID = [31, 19, 28, 16, 30, 29, 20];
    return new Array(arrLength).fill(0).map((_, index) => {
        const dummyObj = getEmptyServicioSolicitado();
        const indexToUse = Math.min(index, opcionesID.length);
        dummyObj.id = opcionesID[indexToUse];
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
    if (!(regex.test(clienteData.email))) return false;

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
            return (
                (id > -1)
            )
        })
    );
}

interface IEnviarDatosCotizacion {
    ensambledObjToSend: ICotizacionEnviar;
    setResultadoOperacionStr: Dispatch<SetStateAction<string>>;
    setDisplayModal: Dispatch<SetStateAction<boolean>>;
    updateIdCotizacionRecibida: (nuevaID: number) => void;
}

export const enviarDatosCotizacion = async (propsObj: IEnviarDatosCotizacion) => {
    const { ensambledObjToSend, setResultadoOperacionStr, setDisplayModal, updateIdCotizacionRecibida } = propsObj;
    const { clienteData, serviciosSolicitados } = ensambledObjToSend;


    //* ---- CHEQUEAR QUE LAS FECHAS DE LA COTIZACIÓN NO SON '' -------------------
    const {fechaCotizacion, fechaValidezCoti} = ensambledObjToSend;
    if ((fechaCotizacion === '') || (fechaValidezCoti === '')) {
        const mensajeError = 'ERROR. AL MENOS UNA DE LAS FECHAS FUE REINICIADA. REVISAR EN EL RESUMEN Y VOLVER A LOS CALENDARIOS';
        setResultadoOperacionStr(mensajeError);
        setDisplayModal(true);
        return mensajeError;
    }


    const clienteDataIsInvalid = (
        (clienteData.nombre === '')
        // (clienteData.rut === '') ||
        // (clienteData.email === '') ||
        // (clienteData.telefono <= 0) ||
        // (clienteData.direccion === '') ||
        // (formaPago === '')
    );
    if (clienteDataIsInvalid) {
        const mensajeError = 'ERROR. EL NOMBRE DEL CLIENTE ESTÁ VACÍO';
        setResultadoOperacionStr(mensajeError);
        setDisplayModal(true);
        return mensajeError;
    }

    //* ---- CHEQUEAR QUE EL RUT ES CORRECTO SI ES QUE LO INGRESARON -------------------
    const rutCliente = clienteData.rut;
    if (rutCliente.length > 0) {
        //* SI ESCRIBIERON UN RUT, QUE AL MENOS ESTÉ BIEN ESCRITO
        if (!(testIfRutIsValid(clienteData.email))) {
            const mensajeError = 'ERROR. RUT INGRESADO ES INVÁLIDO (BÓRRELO O ESCRÍBALO BIEN)';
            setResultadoOperacionStr(mensajeError);
            setDisplayModal(true);
            return mensajeError;
        }
    }


    //* ---- CHEQUEAR QUE EL EMAIL ES CORRECTO SI ES QUE LO INGRESARON ------------------
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    const emailCliente = clienteData.email;
    if (emailCliente.length > 0) {
        //* SI ESCRIBIERON UN EMAIL, QUE AL MENOS ESTÉ BIEN ESCRITO
        if (!(regex.test(clienteData.email))) {
            const mensajeError = 'ERROR. EMAIL INGRESADO ES INVÁLIDO (BÓRRELO O ESCRÍBALO BIEN)';
            setResultadoOperacionStr(mensajeError);
            setDisplayModal(true);
            return mensajeError;
        }
    }

    //* --------------------------------------------------------------------------------


    //* ---- CHEQUEAR QUE EL TELEFONO NO SEA MUY LARGO ----------------------------------
    const telefonoIsInvalid = String(clienteData.telefono).length > maximumLenghts.maxTelefonoLength
    if (telefonoIsInvalid) {
        const mensajeError = 'ERROR. VALOR TELEFONO MUY LARGO';
        setResultadoOperacionStr(mensajeError);
        setDisplayModal(true);
        return mensajeError;
    }
    //* --------------------------------------------------------------------------------


    //* ---- CHEQUEAR QUE NO HAY FILAS DE SERVICIOS VACIAS -----------------------------
    const allServiciosAreValid = serviciosSolicitados.every((servicioItem) => (servicioItem.id > -1));
    if (!allServiciosAreValid) {
        const mensajeError = 'ERROR. HAY FILAS DE TRABAJOS SOLICITADOS VACÍAS';
        setResultadoOperacionStr(mensajeError);
        setDisplayModal(true);
        return mensajeError;
    }
    //* --------------------------------------------------------------------------------



    const operationResultStr = await DataRequester.enviarDatosCotizacion(ensambledObjToSend);

    const IDRecibida = Number(operationResultStr);
    setDisplayModal(true);
    if (IDRecibida > 0) {
        setResultadoOperacionStr('Éxito al guardar. ID cotizacion' + IDRecibida);
        updateIdCotizacionRecibida(IDRecibida);
        return;
    }
    setResultadoOperacionStr(operationResultStr);
    return;
}