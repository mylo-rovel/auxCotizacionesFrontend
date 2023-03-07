import { FC, useContext, useEffect } from 'react';
import { IconButton } from "@mui/material";
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

import { DataRequester } from 'apiClient';
import { TrabajosContext } from "context/trabajos";
import styles from "./ListaServiciosFrame.module.css";
import { IListaServGuardadosFrameProps } from "models";
import { getAcceptableStringValue, eliminarTrabajo } from 'utils';


//TODO: AGREGAR LISTA SERVICIOS GUARDADOS POR EL DÍA Y LA FECHA ESCOGIDA EN EL CONTEXT STATE API
//* LISTA SERVICIOS       FECHA ESCOGIDA

export const ListaServiciosFrame: FC<IListaServGuardadosFrameProps> = (props) => {
    const { setResultadoPeticion, setDisplayModalResultado } = props;

    const { 
        updateIDTrabajoModificar, idTrabajoModificar,
        fechaTrabajoEscogida, 
        updateTrabajosList, listaTrabajos
     } = useContext(TrabajosContext);

    useEffect(() => {
        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios(fechaTrabajoEscogida);
            updateTrabajosList(serviciosArr);
        }
        fetchServicios();
    //* ADDING idTrabajoModificar IS NOT THE MOST EFFICIENT DECISION BUT IS ONE OF THE
    //* BEST IN TERMS OF SIMPLICITY HAVING IN MIND WHAT IS RUNNED INSIDE OF THE 
    //* "guardarTrabajo" FUNCTION (THAT ONE WE RUN WHEN CLICKING THE "Guardar" BUTTON)
    }, [fechaTrabajoEscogida, idTrabajoModificar]);

    const ListaServiciosGuardados = (): JSX.Element => {
        const innerListaElementos = listaTrabajos.map((servicio, index) => {
            return (
                <article key={index} className={styles['servicio-row-container']}>
                    <section className={styles['servicio-row-container-data']}>
                        <h3> {getAcceptableStringValue(servicio.detalle_servicio)}</h3>
                        <h3> {getAcceptableStringValue(servicio.equipo)}</h3>
                        <h3> {getAcceptableStringValue(servicio.codigo)}</h3>
                        <h3>${getAcceptableStringValue(servicio.valor)}</h3>
                        <h3>id:{servicio.id}</h3>
                        {/* <h3>{servicio.detalle_servicio + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}</h3> */}
                    </section>
                    <section className={styles['servicio-row-container-buttons']}>
                        <section>
                            <IconButton
                                size='large'
                                // edge='start'
                                // edge='end'
                                onClick={() => {
                                    updateIDTrabajoModificar(servicio.id);
                                }}
                            >
                                <SettingsOutlinedIcon/>
                            </IconButton>
                            
                            <IconButton
                                size='large'
                                // edge='start'
                                // edge='end'
                                onClick={() => {
                                    eliminarTrabajo({
                                        idTrabajo: servicio.id,
                                        setResultadoPeticion, 
                                        updateIDTrabajoModificar,
                                        setDisplayResultadoModal: setDisplayModalResultado,
                                    })
                                }}
                            >
                                <DeleteForeverOutlinedIcon/>
                            </IconButton>
                            
                        </section>
                    </section>
                </article>
            )
        })
        return( <> {innerListaElementos} </> )
    }

    return <>
    <article className={styles['lista-servicios-container']}>
        <section className={styles['servicios-guardados-title']}>
            <h2>Trabajos guardados</h2>
        </section>
        <ListaServiciosGuardados/>
    </article>
    </>
};