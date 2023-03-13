import { IconButton } from "@mui/material";
import { FC, useContext, useEffect, useState } from 'react';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';

import { TrabajosContext } from "context/trabajos";
import styles from "./ResumenCotizacionFrame.module.css";
import { PortaledModal, ServiciosSolitadosTable } from 'components/singles';
import { enviarDatosCotizacion, getFechaBonitaParaMostrar, generateNewCotizacionPDF } from 'utils';
import { IInputClienteDataEnviar, IResumenCotizacionFrameProps, IServicioIDDataAccessObj } from 'models';

export const ResumenCotizacionFrame: FC<IResumenCotizacionFrameProps> = ({ensambledObjToSend}) => {
    const {fechaCotizacion, fechaValidezCoti, formaPago, clienteData, serviciosSolicitados, clienteEsNuevo} = ensambledObjToSend;
    const { listaTrabajos, fechaTrabajoEscogida, nuevaCotizacionID, updateIdCotizacionRecibida } = useContext(TrabajosContext);

    //* {ID TRABAJO : DATOS DEL TRABAJO}       USADO AL GENERAR LAS FILAS DE LA TABLA
    const [dict_IdTrabajo_DatosTrabajo, setDict_IdTrabajo_DatosTrabajo] = useState<IServicioIDDataAccessObj>({});
    
    //* VALORES USADOS EN EL MODAL FINAL QUE MUESTRA EL RESULTADO DE LA OPERACIÓN
    const [resultadoOperacionStr, setResultadoOperacionStr] = useState<string>('');
    const [displayModal, setDisplayModal] = useState<boolean>(false);

    
    useEffect(() => {
        const setupListasTrabajo = async () => {
            //* SI EN EL DÍA ESCOGIDO NO HAY TRABAJOS, POS NO PODEMOS HACER ALGO UTIL CON UN []
            if (listaTrabajos.length === 0) return;
            
            const coleccionTrabajosObjPorID: IServicioIDDataAccessObj = listaTrabajos.reduce((acc: IServicioIDDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.id] = servicioDataObj;
                return acc;
            }, {})
            setDict_IdTrabajo_DatosTrabajo(coleccionTrabajosObjPorID);
        }

        setupListasTrabajo();
    
    //* SINCE WE HAVE TO USE THE MOST UPDATED listaTrabajos, WE WILL LISTEN TO CHANGES
    //* OF THAT VARIABLE ==> BETTER THAN LISTEN TO fechaTrabajoEscogida    
    //* WE HAVE NO BUSINESS WITH fechaTrabajoEscogida DIRECTLY AS WE DO WITH listaTrabajos
    }, [listaTrabajos]);


    const BotonFinal = () => {
        if (nuevaCotizacionID > 0) {
            const downloadButtonFn = () => {
                // alert(JSON.stringify(serviciosSolicitados))
                if (serviciosSolicitados.length < 1) return;
                generateNewCotizacionPDF({
                    formaPago,
                    fechaTrabajoEscogida,
                    fechaCotizacion,
                    fechaValidezCoti,
                    clienteData,
                    serviciosSolicitadosArr: serviciosSolicitados,
                    // serviciosSolicitadosArr: [{"id":54}],
                    dict_IdTrabajo_DatosTrabajo,
                });
            }
            return(
            <>
            <article className={styles['download-cotizacion-button-container']} onClick={downloadButtonFn}>
                <h3>Descargar</h3>
                <IconButton size='large'>
                    <DownloadOutlinedIcon/>
                </IconButton>
            </article>
            </>);
        }

        const enviarCotizacion = () => enviarDatosCotizacion({ensambledObjToSend, setResultadoOperacionStr, setDisplayModal, updateIdCotizacionRecibida});
        return (
        <>
            <article className={styles['final-send-data-button-container']}>
                <button onClick={enviarCotizacion} className={styles['final-send-data-button']}>
                    ENVIAR COTIZACIÓN
                </button>
            </article>
        </>);
    }

    return (
        <>  
        {
        (displayModal) 
            ? <>
                <PortaledModal buttonText='CERRAR' buttonFn={() => setDisplayModal(false)}>
                    <h1>{resultadoOperacionStr}</h1>
                </PortaledModal>
              </> 
            : null
        }        
        <article className={styles['resumen-cotizacion-main-container']}>

            {/* SECCIÓN DE LOS DATOS TRANSVERSALES ------------------------------------- */}
            <article className={styles['resumen-cotizacion-header-container']}>
                <section>
                    <h4>Resumen de la cotización</h4>
                </section>
                <section className={styles['resumen-header-values']}>
                    <div>Fecha cotización: <h4>{(fechaCotizacion === '') ? 'FECHA NO DEFINIDA!!!!!' : fechaCotizacion}</h4></div>
                    <div>Fecha validez cotización: <h4>{(fechaValidezCoti === '') ? 'FECHA NO DEFINIDA!!!!!' : fechaValidezCoti}</h4></div>
                    <div>¿Cliente es nuevo? <h4>{clienteEsNuevo ? 'Es nuevo!' : 'Es recurrente! (antiguo)'}</h4></div>
                </section>
            </article>


            {/* SECCIÓN DE LOS DATOS DEL CLIENTE --------------------------------------- */}
            <article className={styles['resumen-cliente-container']}>
                <section>
                    <h4>Cliente</h4>
                </section>
                <section className={styles['resumen-cliente-container-values']}>                    
                    <ClienteElementsJSX clienteData={clienteData} formaPago={formaPago}/>
                </section>
            </article>


            {/* SECCIÓN DE LA TABLA ---------------------------------------------------- */}
            <article className={styles['resumen-serviciossolicitados-container']}>
                <section>
                    <h4>Servicios solicitados del día {getFechaBonitaParaMostrar(fechaTrabajoEscogida)}</h4>
                </section>
                <ServiciosSolitadosTable serviciosSolicitadosArr={serviciosSolicitados} dict_IdTrabajo_DatosTrabajo={dict_IdTrabajo_DatosTrabajo}/>
            </article>

        </article>

        {nuevaCotizacionID}
        <BotonFinal/>
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