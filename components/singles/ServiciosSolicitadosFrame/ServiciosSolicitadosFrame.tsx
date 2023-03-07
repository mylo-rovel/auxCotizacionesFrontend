import Calendar from 'react-calendar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FC, useState, useEffect, SetStateAction, Dispatch, useContext } from 'react';

import { DataRequester } from 'apiClient';
import styles from "./ServiciosSolicitadosFrame.module.css"
import { TrabajosContext } from "context/trabajos";
import { getEmptyServicioDataObj, getEmptyServicioSolicitado, getValidDateString, maximumLenghts } from 'utils';
import { 
    IServicioData, IServiciosSolicitadosFrameProps, 
    IServicioSolicitado, IServicioDataAccessObj, IServicioIDDataAccessObj
} from "models";
import { PortaledModal } from '../PortaledModal/PortaledModal';


type labelServicios = { label: string };

export const ServiciosSolicitadosFrame: FC<IServiciosSolicitadosFrameProps> = ({ parentServSolicitadosArrSetter, parentServiciosSolicitadosArr }) => {
    const { fechaTrabajoEscogida, updateFechaTrabajoEscogida, displayCalendar, setDisplayCalendarModal } = useContext(TrabajosContext);

    const displayModalCalendarioButtonFn = () => { if (document) setDisplayCalendarModal(false); }     
    const ModalCalendario = () => {
        if (!displayCalendar) return <></>;
        return (
        <>
            <PortaledModal contentIsNotOnlyText={true} buttonText='CERRAR' buttonFn={displayModalCalendarioButtonFn}>
                <article className={styles['calendar-frame']}>                
                    <Calendar 
                        showFixedNumberOfWeeks = {false}
                        showNeighboringMonth = {false}
                        locale='es'
                        onClickDay={(newDate) => {
                            const dateString = getValidDateString(newDate);
                            // alert(dateString);
                            updateFechaTrabajoEscogida(dateString);
                            setDisplayCalendarModal(false);
                        }}
                    />    
                </article>        
            </PortaledModal>
        </>)
    }

    return (
    <>
        <ModalCalendario/>
        <article className={styles['servicios-solicitados-container']}>
            <table>
                <colgroup>
                    <col span={1} className={styles['table-column-codigo']}/>
                    <col span={1} className={styles['table-column-detalle']}/>
                    <col span={1} className={styles['table-column-equipo']}/>
                    <col span={1} className={styles['table-column-info_adicional']}/>
                    <col span={1} className={styles['table-column-valor']}/>
                </colgroup>

                <thead>
                    <tr>
                        <th colSpan={5}>Trabajos del día {fechaTrabajoEscogida}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Código</th>
                        <th>Detalle trabajo</th>
                        <th>Equipo</th>
                        <th>Info adicional</th>
                        <th>Valor</th>
                    </tr>
                    
                    <TableBodyRowsCollection
                        parentServSolicitadosArrSetter={parentServSolicitadosArrSetter}
                        parentServiciosSolicitadosArr={parentServiciosSolicitadosArr}
                    />

                </tbody>          
            </table>
        </article>
    </>
    )
};













//* -----------------------------------------------------------------------------
//* -----------------------------------------------------------------------------
//* -----------------------------------------------------------------------------
//* COMPONENTE COLECCION DE FILAS DE LA TABLA -----------------------------------

interface TableBodyRowsCollectionProps {
    //* ESTA ES LA FUNCIÓN QUE EJECUTAREMOS CUANDO INTERACTUEN CON LOS BOTONES DE CAMBIAR PAGINA
    parentServSolicitadosArrSetter: Dispatch<SetStateAction<IServicioSolicitado[]>>;

    //* EN ESTA LISTA GUARDAMOS LOS SERVICIOS SOLICITADOS A ENVIAR
    parentServiciosSolicitadosArr: IServicioSolicitado[]
}


const TableBodyRowsCollection: FC<TableBodyRowsCollectionProps> = (propsObj) => {
    const { fechaTrabajoEscogida, updateFechaTrabajoEscogida, updateTrabajosList } = useContext(TrabajosContext);

    //* NOMBRE TRABAJO : DATOS DEL TRABAJO
    const [coleccionServicios, setColeccionServGuardados] = useState<IServicioDataAccessObj>({});

    //* ID TRABAJO : DATOS DEL TRABAJO
    const [coleccionServiciosPorID, setColeccionServiciosPorID] = useState<IServicioIDDataAccessObj>({});
    
    //* LISTA PARA EL COMPONENTE AUTOCOMPLETAR
    const [listaServiciosLabel, setListaServiciosLabel] = useState<labelServicios[]>([]);


    //* just for the rerendering
    const [_, setAmountOfRows] = useState<number>(0);

    const { parentServiciosSolicitadosArr, parentServSolicitadosArrSetter } = propsObj;

    // * FUNCION QUE SE EJECUTA EN EL BOTON (+)
    const addNewNextServicioSolicitado = (rowIndex: number) => () => {
        if (rowIndex < 0) return;
        const proxyListaSolicitados = [...parentServiciosSolicitadosArr];
        proxyListaSolicitados.push(getEmptyServicioSolicitado());
        
        parentServSolicitadosArrSetter(proxyListaSolicitados);

        //* PARA EJECUTAR EL useEffect
        setAmountOfRows(proxyListaSolicitados.length);
    }

    // * FUNCION QUE SE EJECUTA EN EL BOTON (-)
    const removeCurrentServicioSolicitado = (rowIndex: number) => () => {
        if (rowIndex < 0) return;
        const proxyListaSolicitados = [...parentServiciosSolicitadosArr];
        proxyListaSolicitados.pop();

        parentServSolicitadosArrSetter(proxyListaSolicitados);

        //* PARA EJECUTAR EL useEffect
        setAmountOfRows(proxyListaSolicitados.length);
    }


    useEffect(() => {
        if (fechaTrabajoEscogida === '') {
            const todayDateObj = new Date();
            updateFechaTrabajoEscogida(getValidDateString(todayDateObj));
        }

        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios(fechaTrabajoEscogida);
            updateTrabajosList(serviciosArr);

            // TODO: PUNTO OPTIMIZABLE => RECORREMOS LA MISMA LISTA 2 VECES
            const coleccionServiciosObj: IServicioDataAccessObj = serviciosArr.reduce((acc: IServicioDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.detalle_servicio] = servicioDataObj;
                return acc;
            }, {})
            setColeccionServGuardados(coleccionServiciosObj);

            const coleccionServiciosObjPorID: IServicioIDDataAccessObj = serviciosArr.reduce((acc: IServicioDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.id] = servicioDataObj;
                return acc;
            }, {})
            setColeccionServiciosPorID(coleccionServiciosObjPorID);        
            
            const nombreServicios: labelServicios[] = serviciosArr.map((item) => ({label: item.detalle_servicio}));
            setListaServiciosLabel(nombreServicios);
        }

        //* IF THE LIST IS EMPTY, REFETCH BECAUSE WE HAVE NO DATA OF SERVICIOS
        if (listaServiciosLabel.length === 0) fetchServicios();
    }, [fechaTrabajoEscogida]);

    const coleccionServiciosIsRdy = (Object.keys(coleccionServicios).length > 0);
    const coleccionServiciosPorIDIsRdy = (Object.keys(coleccionServiciosPorID).length > 0);
    const conditionsAreOK = (coleccionServiciosIsRdy) && (coleccionServiciosPorIDIsRdy);

    const FilasTabla = () => {
        if (!conditionsAreOK) return <></>;
        
        const serviciosSolicitadosArr = parentServiciosSolicitadosArr;
        return (
        <>{
        serviciosSolicitadosArr.map((itemServicio, index) => {
            const servicioFila = serviciosSolicitadosArr[index];
            const servicioElegidoProp = (servicioFila.id in coleccionServiciosPorID) ? coleccionServiciosPorID[servicioFila.id].detalle_servicio : null;
            
            return <ServicioSolicitadoRow 
                key = {`servicio_solicitado_${index}`}

                rowIndex={index}
                servicioElegidoProp={servicioElegidoProp}
                codigoValueProp={itemServicio.codigo}                    
                cantidadValueProp={itemServicio.id}
                
                coleccionServicios={coleccionServicios} //* PARA ACCEDER A LOS DATOS USANDO EL NOMBRE
                listaNombreServicios={listaServiciosLabel} //* PARA EL AUTO COMPLETE
                listaServiciosSolicitados={serviciosSolicitadosArr} //* PARA ACCEDER A LO QUE SE ENVIARÁ
                //* ACCEDEMOS AL OBJETO CORRECTO GRACIAS A (rowIndex: number)
                
                addNewRow={addNewNextServicioSolicitado(index)}
                removeRow={removeCurrentServicioSolicitado(index)}

                parentServSolicitadosArrSetter={parentServSolicitadosArrSetter} />
        })
        }</>)
    }

    return (
    <>
        <FilasTabla/>
    </>
    )
};





//* -----------------------------------------------------------------------------
//* -----------------------------------------------------------------------------
//* -----------------------------------------------------------------------------
//* COMPONENTE FILA ESPECÍFICA --------------------------------------------------

interface ServicioSoliRowProp {
    rowIndex: number;
    servicioElegidoProp: string | null;
    codigoValueProp: string;
    cantidadValueProp: number;

    coleccionServicios: IServicioDataAccessObj; //* PARA ACCEDER A LOS DATOS USANDO EL NOMBRE
    listaNombreServicios: labelServicios[]; //* PARA EL AUTO COMPLETE
    listaServiciosSolicitados: IServicioSolicitado[]; //* PARA ACCEDER A LO QUE SE ENVIARÁ

    //* FUNCIÓN DEL BOTON (+)
    addNewRow: () => void;  
    //* FUNCIÓN DEL BOTON (-)
    removeRow: () => void;

    //* PARA MODIFICAR LA LISTA PERTENECIENTE A UN COMPONENTE PADRE
    parentServSolicitadosArrSetter: Dispatch<SetStateAction<IServicioSolicitado[]>>;
}

const ServicioSolicitadoRow: FC<ServicioSoliRowProp> = (propsObj) => {
    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    //* VALORES DE CADA INPUT
    const [servicioElegido, setServicioElegido] = useState<string | null>('');
    const [codigoValue, setCodigoValue] = useState<string>('');
    const [cantidadValue, setCantidadValue] = useState<number>(0);
    
    //* OBJETO QUE AYUDA A QUE MOSTREMOS DATOS DEL SERVICIO
    const [servicioData, setServicioData] = useState<IServicioData>(getEmptyServicioDataObj());

    //* SÓLO PERMITIR MODIFICAR SI EL MOUSE ESTÁ ENCIMA
    const [rowIsActive, setRowIsActive] = useState<boolean>(false);
    //* --------------------------------------------------------------------------------

    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    const {
        rowIndex, //* PARA ACCEDER A listaServiciosSolicitados Y CHEQUEAR OTRAS COSAS
        
        codigoValueProp, cantidadValueProp, servicioElegidoProp, //* PARA DESPLEGAR DATOS GUARDADOS
        
        coleccionServicios, listaNombreServicios, //* PARA CHEQUEAR Y PODER USAR EL AUTOCOMPLETAR
        
        listaServiciosSolicitados, parentServSolicitadosArrSetter, //* PARA MANEJAR LA LISTA A ENVIAR DEL COMPONENTE PADRE
        
        addNewRow, removeRow //* PARA DARLE FUNCIONALIDAD A LOS BOTONES (+) Y (-)
    } = propsObj;
    //* --------------------------------------------------------------------------------


    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    useEffect(() => {
        if (codigoValueProp !== '') {
            setCodigoValue(codigoValueProp);
        };
        if (cantidadValueProp > 0) {
            setCantidadValue(cantidadValueProp);
        };
        
        if ((servicioElegidoProp !== '') && (servicioElegidoProp !== null)) {
            const servicioData = coleccionServicios[servicioElegidoProp];
            setServicioData(servicioData);
            setServicioElegido(servicioElegidoProp);
        }
        else {
            setServicioData(getEmptyServicioDataObj());
        };
    }, []);
    //* --------------------------------------------------------------------------------


    //* SETTERS DE LOS INPUTS ----------------------------------------------------------
    //* --------------------------------------------------------------------------------

    const setCodigoInputValue = (newCodigo: string) => {
        if (newCodigo !== '') {
        };
        listaServiciosSolicitados[rowIndex].codigo = newCodigo;
        setCodigoValue(newCodigo);
    }
    const setCantidadInputValue = (newCantidad: number) => {
        // if (newCantidad >= 0) {
        if ((newCantidad >= 0) && (`${newCantidad}`.length <= maximumLenghts.maxCantidadLength)) {
            listaServiciosSolicitados[rowIndex].cantidad = newCantidad;
            setCantidadValue(newCantidad);
        };
    }

    const setNewServicioElegido = (_: unknown, nuevoServicioElegido: string) => {
        let servicioData: IServicioData = getEmptyServicioDataObj();
        let servicioASettear: typeof servicioElegido = null;

        if (nuevoServicioElegido in coleccionServicios) {
            servicioData = coleccionServicios[nuevoServicioElegido];
            servicioASettear = nuevoServicioElegido;
        }
        
        setServicioData(servicioData);
        setServicioElegido(servicioASettear);
        
        const proxyListaSolicitados = [...listaServiciosSolicitados];                
        proxyListaSolicitados[rowIndex].id = servicioData.id;
        parentServSolicitadosArrSetter(proxyListaSolicitados);
    }
    //* --------------------------------------------------------------------------------


    return (
    <>
        <tr 
            className={styles['servicio-solicitado-row']}
            onMouseEnter={() => {
                setRowIsActive(true);
            }}
            onMouseLeave={() => {
                setRowIsActive(false);

                //* SI SACAMOS EL MOUSE DE LA FILA, GUARDAR LOS CAMBIOS
                const proxyListaSolicitados = [...listaServiciosSolicitados];                
                parentServSolicitadosArrSetter(proxyListaSolicitados);
            }}
        >
            <td className={styles['table-column-codigo-cell']}>{/* Código */}
                {(!rowIsActive)
                    ? <h4>{codigoValue}</h4>
                    : <input 
                        type='text'
                        onChange={(eObj) => {
                            const newCodigo = eObj.target.value;
                            setCodigoInputValue(newCodigo);
                        }}
                        value={codigoValue}
                      />
                }

            </td>
            <td className={styles['servicio-solicitado-row-autocomplete']}>{/* Descripcion */}
                {(!rowIsActive)
                    ? <h4>{servicioElegido}</h4>
                    : <Autocomplete 
                        options={listaNombreServicios} 
                        renderInput={(params) => <TextField {...params} label="" />} 
                        onInputChange={setNewServicioElegido}
                        disabled={!rowIsActive}
                      /> 
                }

            </td>
            <td className={styles['table-cell-valorunitario']}>{/* Valor Unitario */}
                <h4>${servicioData.valor ?? '0'} c/u</h4>
            </td>
            <td className={styles['table-cell-cantidad']}>{/* Cantidad */}
                {(!rowIsActive)
                    ? <h4>{cantidadValue}</h4>
                    : <input 
                        type='number'
                        onChange={(eObj) => {
                            const newCantidad = Number(eObj.target.value);
                            setCantidadInputValue(newCantidad)
                        }}
                        value={cantidadValue}
                      />
                }
            </td>
            <td className={styles['table-cell-valor']}>{/* Valor */}
                <h4>${servicioData.valor * cantidadValue}</h4>
            </td>
            
            {
            (rowIndex !== (listaServiciosSolicitados.length-1))
            ? <></>
            : <>
                <td className={styles['servicio-solicitado-row-button']}>
                    <button className={styles['add-row-button']} onClick={addNewRow}>
                        <h4>+</h4>
                    </button>
                </td>

                <td className={styles['servicio-solicitado-row-button']}>            
                    {(rowIndex === 0)
                        ? <button className={styles['hidden-button']}>
                            <h4> </h4>
                        </button>
                        : <button className={styles['remove-row-button']} onClick={removeRow}>
                            <h4>-</h4>
                        </button>
                    }
                </td>
            </>
            }
        </tr>
    </>
    )
};





    // // * FUNCION QUE SE EJECUTA EN EL BOTON (+)
    // const addNewNextServicioSolicitado = (rowIndex: number) => () => {
    //     if (rowIndex < 0) return;
    //     // const newArray = modifyArr({
    //     //     mode: 'add',
    //     //     arrToModify: listaServiciosSolicitados,
    //     //     indexToUse: rowIndex + 1,
    //     //     elementToAdd: getEmptyServicioSolicitado()
    //     // }) as IServicioSolicitado[];
    //     // setListaSolicitados(newArray);

    //     listaServiciosSolicitados.push(getEmptyServicioSolicitado());
    //     const proxyListaSolicitados = [...listaServiciosSolicitados];
    //     setListaSolicitados(proxyListaSolicitados);
    //     parentServSolicitadosArrSetter(proxyListaSolicitados);
    // }

    // // * FUNCION QUE SE EJECUTA EN EL BOTON (-)
    // const removeCurrentServicioSolicitado = (rowIndex: number) => () => {
    //     if (rowIndex < 0) return;
    //     // const newArray = modifyArr({
    //     //     mode: 'remove',
    //     //     arrToModify: listaServiciosSolicitados,
    //     //     indexToUse: rowIndex + 1,
    //     // }) as IServicioSolicitado[];
    //     // setListaSolicitados(newArray);

    //     listaServiciosSolicitados.pop();
    //     const proxyListaSolicitados = [...listaServiciosSolicitados];
    //     setListaSolicitados(proxyListaSolicitados);
    //     parentServSolicitadosArrSetter(proxyListaSolicitados);
    // }