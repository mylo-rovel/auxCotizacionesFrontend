import { FC, useEffect, useRef, useState } from 'react';

import { DataRequester } from "apiClient";
import { getServiciosIDCollection } from 'utils';
import styles from "./ServiciosFrame.module.css";
import { ListaServiciosFrame } from "./ListaServiciosFrame/ListaServiciosFrame";
import { MainServiciosFrame } from "./MainServiciosFrame/MainServiciosFrame";
import { ModifyServicioFrame } from "./ModifyServicioFrame/ModifyServicioFrame";
import { IServiciosFrameProps, IServicioIDData, modoInterfazServicios, IServicioModificadoData, IServicioDataToSend } from "models";

export const ServiciosFrame: FC<IServiciosFrameProps> = () => {
    const [coleccionServicios, setListaServGuardados] = useState<IServicioIDData>({});
    const [modoInterfaz, setModoInterfaz] = useState<modoInterfazServicios>('AGREGAR');
    const [servicioBuscado, setServicioBuscado] = useState<string>('');
    const [precioServicio, setPrecioServicio] = useState<number>(0);
    const servicioModificadoData = useRef<IServicioModificadoData>({nuevoNombre:'', nuevoPrecio:0});

    const [resultadoPeticion, setResultadoPeticion] = useState<string>('');

    useEffect(() => {
        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios();            
            setListaServGuardados(getServiciosIDCollection(serviciosArr));
        }
        fetchServicios();
    }, []);

    //? LISTA DE LOS NOMBRES DE LOS SERVICIOS
    const serviciosGuardados = Object.keys(coleccionServicios);

    const servicioDataToSend: IServicioDataToSend = {
        coleccionServicios,
        modoInterfaz,
        servicioBuscado,
        precioServicio,
        servicioModificadoData: servicioModificadoData.current,
        setResultadoPeticion
    }
    
    return <>
        <article className={styles['servicio-error-container']}>
            <h1>{resultadoPeticion}</h1>
        </article>

        <article style={{marginTop: ((resultadoPeticion === '') ? '3.3rem' : '0') }}>
            <section className={styles['servicios-frame-container']}>
                <ModifyServicioFrame 
                    modoInterfaz={modoInterfaz}
                    nombreOriginalModificar={servicioBuscado}
                    coleccionServicios={coleccionServicios}
                    nuevoServicioData={servicioModificadoData}
                />
                <MainServiciosFrame 
                    serviciosGuardados={serviciosGuardados} 
                    mainServicioSetter={setServicioBuscado}
                    mainPrecioSetter={setPrecioServicio}
                    modoInterfaz={modoInterfaz} 
                    modoSetter={setModoInterfaz}
                    
                    datosServicioEnviar={servicioDataToSend}   
                />
                <ListaServiciosFrame 
                    serviciosGuardados={serviciosGuardados}
                />
            </section>
        </article>
    </>
};