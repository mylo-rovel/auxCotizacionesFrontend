import { DataRequester } from "apiClient";
import { 
    IServicioBodyRequestFormat, IModificarServicioDataEnviar, IServicioDataToSend,
    ICotizacionEnviar, IServicioSolicitado, IInputClienteDataEnviar,
    IValoresExtraCotizacion, IServicioData
} from "models";

// const milisecondsAfterReset = 5000*1000;
// const reloadAfterAWhile = () => setTimeout(() => window.location.reload(), milisecondsAfterReset);

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
            //? CHEQUEAR SI LOS DATOS A ENVIAR SON VÁLIDOS
            if ((servicioBuscado === '') || (precioServicio < 1) || (`${precioServicio}`.length > 9 )){
                console.log("Error. AGREGAR", servicioBuscado, precioServicio);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS PARA AGREGAR EL SERVICIO');
                setDisplayModal(true);
            }
            else {
                resultadoPeticion = await DataRequester.agregarServicioNuevo(reqBodyToSend);
                setResultadoPeticion(resultadoPeticion);
                setDisplayModal(true);
            }
            return;
        //* --------------------------------------------------------
        case "MODIFICAR":
            //? CHEQUEAR SI LOS DATOS A ENVIAR SON VÁLIDOS
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
    
                resultadoPeticion = await DataRequester.modificarServicioGuardado(rebBodyToSend_Modify);
                setResultadoPeticion(resultadoPeticion);
                setDisplayModal(true);
            }
            return;
        
        case "ELIMINAR":
            //? CHEQUEAR SI LOS DATOS A ENVIAR SON VÁLIDOS
            if (!(servicioBuscado in coleccionServicios)){
                console.log("Error. ELIMINAR", servicioBuscado, coleccionServicios);
                console.log(servicioBuscado, coleccionServicios);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS PARA ELIMINAR EL SERVICIO');
                setDisplayModal(true);
            }
            else {
                resultadoPeticion = await DataRequester.borrarServicioGuardado(reqBodyToSend);
                setResultadoPeticion(resultadoPeticion);
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
        id: 0,
        descripcion: '',
        valor_unitario: 0,
        created_at: '',
        updated_at: '',
    }
};