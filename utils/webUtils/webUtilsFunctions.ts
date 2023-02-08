import { DataRequester } from "apiClient";
import { IServicioBodyRequestFormat, IModificarServicioDataEnviar, IServicioDataToSend } from "models";


export const enviarDatosServicio = async (dataToSend: IServicioDataToSend) => {
    const {coleccionServicios, modoInterfaz, servicioBuscado, precioServicio, servicioModificadoData, setResultadoPeticion} = dataToSend;
    let resultadoPeticion = '';
    
    const reqBodyToSend: IServicioBodyRequestFormat = {
        descripcion: servicioBuscado,
        valor_unitario: precioServicio
    }

    switch (modoInterfaz) {
        case "AGREGAR":
            //? NO CONTINUAR EN CASO DE VALOR INVÁLIDO
            if ((servicioBuscado === '') || (precioServicio < 1)){
                console.log("Error. AGREGAR", servicioBuscado, precioServicio);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS');
                return;
            }
            
            resultadoPeticion = await DataRequester.agregarServicioNuevo(reqBodyToSend);
            window.location.reload();
            setResultadoPeticion(resultadoPeticion);
            return;
        //* --------------------------------------------------------
        case "MODIFICAR":
            //? NO CONTINUAR EN CASO DE VALOR INVÁLIDO
            if (!(servicioBuscado in coleccionServicios)){
                console.log("Error. MODIFICAR", servicioBuscado, coleccionServicios);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS');
                return;
            }

            const rebBodyToSend_Modify: IModificarServicioDataEnviar = {
                old_servicio: {
                    descripcion: servicioBuscado,
                    valor_unitario: precioServicio,
                },
                new_servicio: {
                    descripcion: servicioModificadoData.nuevoNombre,
                    valor_unitario: servicioModificadoData.nuevoPrecio
                }
            }

            resultadoPeticion = await DataRequester.modificarServicioGuardado(rebBodyToSend_Modify);
            setResultadoPeticion(resultadoPeticion);
            return;
        
        case "ELIMINAR":
            //? NO CONTINUAR EN CASO DE VALOR INVÁLIDO
            if (!(servicioBuscado in coleccionServicios)){
                console.log("Error. ELIMINAR", servicioBuscado, coleccionServicios);
                setResultadoPeticion('DATOS ENTREGADOS NO VÁLIDOS');
                return;
            }
            
            resultadoPeticion = await DataRequester.borrarServicioGuardado(reqBodyToSend);
            setResultadoPeticion(resultadoPeticion);
            return;

        default:
            alert("MODO NO VÁLIDO")
            resultadoPeticion = 'ERROR. MODO NO VÁLIDO'
            setResultadoPeticion(resultadoPeticion);
            return;
    }
}