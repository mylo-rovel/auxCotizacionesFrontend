import { FC, useEffect, useRef, useState } from 'react';

import { DataRequester } from "apiClient";
import { getServiciosIDCollection } from 'utils';
import styles from "./ServiciosFrame.module.css";
import { PortalContainer, FancyButton } from 'components/singles';
import { ListaServiciosFrame } from "./ListaServiciosFrame/ListaServiciosFrame";
import { MainServiciosFrame } from "./MainServiciosFrame/MainServiciosFrame";
import { ModifyServicioFrame } from "./ModifyServicioFrame/ModifyServicioFrame";
import { IServicioData, IServiciosFrameProps, modoInterfazServicios, IServicioModificadoData, IServicioDataToSend } from "models";

export const ServiciosFrame: FC<IServiciosFrameProps> = () => {
    const [coleccionServicios, setListaServGuardados] = useState<IServicioData[]>([]);
    const [modoInterfaz, setModoInterfaz] = useState<modoInterfazServicios>('AGREGAR');
    const [servicioBuscado, setServicioBuscado] = useState<string>('');
    const [precioServicio, setPrecioServicio] = useState<number>(0);
    const servicioModificadoData = useRef<IServicioModificadoData>({nuevoNombre:'', nuevoPrecio:0});
    
    const [displayModal, setDisplayModal] = useState<boolean>(false);
    const [resultadoPeticion, setResultadoPeticion] = useState<string>('');

    useEffect(() => {
        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios();            
            setListaServGuardados(serviciosArr);
        }
        fetchServicios();
    }, [displayModal]);

    const servicioDataToSend: IServicioDataToSend = {
        coleccionServicios: getServiciosIDCollection(coleccionServicios),
        modoInterfaz,
        servicioBuscado,
        precioServicio,
        servicioModificadoData: servicioModificadoData.current,
        setResultadoPeticion,
        setDisplayModal
    }
    
    const displayModalButtonFn = () => {
        if (document) {
            // setServicioBuscado('');
            // setPrecioServicio(0);            
            setDisplayModal(false);
            document.location.reload();
        }
    }

    return <>
        {(displayModal) ? 
        <>
            <PortalContainer>
                <article className={styles['resultado-peticion-container']}>
                    <h1>{resultadoPeticion}</h1>
                    <section>
                        <FancyButton textToDisplay='CERRAR' onClickFn={displayModalButtonFn}/>
                    </section>
                </article>
            </PortalContainer>
        </> : null}

        {/* <article style={{marginTop: ((resultadoPeticion === '') ? '3.3rem' : '0') }}> */}
        <article>
            <section className={styles['servicios-frame-container']}>
                <ModifyServicioFrame 
                    modoInterfaz={modoInterfaz}
                    nombreOriginalModificar={servicioBuscado}
                    coleccionServicios={getServiciosIDCollection(coleccionServicios)}
                    nuevoServicioData={servicioModificadoData}
                />
                <MainServiciosFrame 
                    serviciosGuardados={coleccionServicios} 
                    mainServicioSetter={setServicioBuscado}
                    mainPrecioSetter={setPrecioServicio}
                    modoInterfaz={modoInterfaz} 
                    modoSetter={setModoInterfaz}
                    
                    datosServicioEnviar={servicioDataToSend}   
                />
                <ListaServiciosFrame 
                    serviciosGuardados={coleccionServicios}
                />
            </section>
        </article>
    </>
};