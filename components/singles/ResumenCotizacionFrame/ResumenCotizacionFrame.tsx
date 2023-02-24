import { FC, useEffect, useState } from 'react';

import { DataRequester } from 'apiClient';
import { enviarDatosCotizacion } from 'utils';
import styles from "./ResumenCotizacionFrame.module.css";
import { PortaledModal, ServiciosSolitadosTable } from 'components/singles';
import { IInputClienteDataEnviar, IResumenCotizacionFrameProps, IServicioIDDataAccessObj } from 'models';

export const ResumenCotizacionFrame: FC<IResumenCotizacionFrameProps> = ({ensambledObjToSend}) => {
    const [coleccionServiciosPorID, setColeccionServiciosPorID] = useState<IServicioIDDataAccessObj>({});
    const [resultadoOperacionStr, setResultadoOperacionStr] = useState<string>('');
    const [operacionFueExitosa, setOperacionFueExitosa] = useState<boolean>(false);
    const [displayModal, setDisplayModal] = useState<boolean>(false);

    const {fechaCotizacion, fechaValidezCoti, formaPago, clienteData, serviciosSolicitados, clienteEsNuevo} = ensambledObjToSend;

    //TODO: CREAR BOOLEAN QUE INDIQUE SI LOS DATOS SON VALIDOS
    
    //TODO: USAR UN BOTON QUE AL TOCAR CHEQUEE TODO Y MUESTRE UN MODAL
    //TODO: QUE EL MODAL MUESTRE SI LA OPERACIÓN FUE EXITOSA
    //TODO: QUE EL MODAL MUESTRE SI LA OPERACIÓN NO FUE EXITOSA
    //TODO: QUE EL MODAL MUESTRE SI HAY ERRORES Y CUALES (EARLY RETURNS)
    //TODO: TENEMOS QUE CREAR UNA FUNCIÓN QUE RETORNE UN STRING QUE MOSTRAREMOS
    
    //TODO: SI LA OPERACIÓN ES EXITOSA (status code 200) RECARGAR LA PAGINA ACTUAL


    useEffect(() => {
        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios();

            const coleccionServiciosObjPorID: IServicioIDDataAccessObj = serviciosArr.reduce((acc: IServicioIDDataAccessObj, servicioDataObj) => {
                //* ID SERVICIO : DATOS DEL SERVICIO
                acc[servicioDataObj.id] = servicioDataObj;
                return acc;
            }, {})
            setColeccionServiciosPorID(coleccionServiciosObjPorID);        
        }
        fetchServicios();
    }, []);

    const enviarCotizacion = () => {
        enviarDatosCotizacion(ensambledObjToSend, setResultadoOperacionStr, setDisplayModal, setOperacionFueExitosa)
    }

    const finalModalButtonFunction = () => {
        if (operacionFueExitosa) {
            window.location.reload();
            return;
        }
        setDisplayModal(false);
    }

    return (
        <>  
        {
        (displayModal) 
            ? <>
                <PortaledModal buttonText='CERRAR' buttonFn={() => {
                    finalModalButtonFunction();
                }}>
                    <h1>{resultadoOperacionStr}</h1>
                </PortaledModal>
              </> 
            : null
        }
        <article className={styles['resumen-cotizacion-main-container']}>
            <article className={styles['resumen-cotizacion-header-container']}>
                <section>
                    <h4>Resumen de la cotización</h4>
                </section>
                <section className={styles['resumen-header-values']}>
                    <div>Fecha cotización: <h4>{fechaCotizacion}</h4></div>
                    <div>Fecha validez cotización: <h4>{fechaValidezCoti}</h4></div>
                    <div>¿Cliente es nuevo? <h4>{clienteEsNuevo ? 'Es nuevo!' : 'Es recurrente! (antiguo)'}</h4></div>
                </section>
            </article>

            <article className={styles['resumen-cliente-container']}>
                <section>
                    <h4>Cliente</h4>
                </section>
                <section className={styles['resumen-cliente-container-values']}>                    
                    <ClienteElementsJSX clienteData={clienteData} formaPago={formaPago}/>
                </section>
            </article>

            <article className={styles['resumen-serviciossolicitados-container']}>
                <section>
                    <h4>Servicios solicitados</h4>
                </section>
                <ServiciosSolitadosTable serviciosSolicitadosArr={serviciosSolicitados} coleccionServiciosPorID={coleccionServiciosPorID}/>
            </article>
        </article>
        <article className={styles['final-send-data-button-container']}>
            <button onClick={enviarCotizacion} className={styles['final-send-data-button']}>
                ENVIAR COTIZACIÓN
            </button>
        </article>
        </>
    )
}

//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*- SPECIFIC COMPONENTS ---------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------
//*-------------------------------------------------------------------------------------

interface ClienteElementsJSXProps {
    clienteData: IInputClienteDataEnviar;
    formaPago: string;
}

const ClienteElementsJSX:FC<ClienteElementsJSXProps> = ({clienteData, formaPago}): JSX.Element => {
    let clienteDataArr = Object.entries(clienteData);
    clienteDataArr.push(['formaPago', formaPago]);
    
    const toNotIncludeProps = ['id', 'created_at', 'updated_at'];

    return (
        <>
        {clienteDataArr.map((item, index) => {
            if (toNotIncludeProps.includes(item[0])) return <></>;
            return <div key={index}>{item[0]}<h4>{item[1]}</h4></div>
        })}
        </>)
}