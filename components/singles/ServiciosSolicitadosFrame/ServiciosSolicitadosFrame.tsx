import { FC, useState, useEffect, SetStateAction, Dispatch } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


import { DataRequester } from 'apiClient';
import { getEmptyServicioDataObj, getEmptyServicioSolicitado, modifyArr, saveCotizacionesSwitcherID_container } from 'utils';
import styles from "./ServiciosSolicitadosFrame.module.css";
import { 
    IServicioData, IServiciosSolicitadosFrameProps, 
    IServicioSolicitado, IServicioDataAccessObj, IServicioIDDataAccessObj
} from "models";

type labelServicios = { label: string };

export const ServiciosSolicitadosFrame: FC<IServiciosSolicitadosFrameProps> = ({ parentServSolicitadosArrSetter, parentServiciosSolicitadosArr }) => {
    //* TENIENDO ESTE OBJECTO PODEMOS ACCEDER A CUALQUIER SUB-OBJETO DE SERVICIO
    //* A TRAVÉS DEL NOMBRE (LOS CUALES ESTÁN EN: listaServiciosLabel) PARA ACCEDER A SUS DATOS
    const [coleccionServicios, setColeccionServGuardados] = useState<IServicioDataAccessObj>({});
    //* ESTE OBJETO HACE LO MISMO QUE "coleccionServicios" PERO LAS KEYS SON LAS ID (number) EN LUGAR DEL NOMBRE
    const [coleccionServiciosPorID, setColeccionServiciosPorID] = useState<IServicioIDDataAccessObj>({});
    
    //* ESTA LISTA CONTENDRA LOS NOMBRES DE LOS SERVICIOS PARA EL COMPONENTE AUTOCOMPLETAR
    const [listaServiciosLabel, setListaServiciosLabel] = useState<labelServicios[]>([]);
    

    useEffect(() => {
        const fetchServicios = async () => {
            const serviciosArr = await DataRequester.getListaServicios();
      
            // TODO: PUNTO OPTIMIZABLE => RECORREMOS LA MISMA LISTA 2 VECES
            const coleccionServiciosObj: IServicioDataAccessObj = serviciosArr.reduce((acc: IServicioDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.descripcion] = servicioDataObj;
                return acc;
            }, {})
            setColeccionServGuardados(coleccionServiciosObj);

            const coleccionServiciosObjPorID: IServicioIDDataAccessObj = serviciosArr.reduce((acc: IServicioDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.id] = servicioDataObj;
                return acc;
            }, {})
            setColeccionServiciosPorID(coleccionServiciosObjPorID);        

            const nombreServicios: labelServicios[] = serviciosArr.map((item) => ({label: item.descripcion}));
            setListaServiciosLabel(nombreServicios)
        }

        //* IF THE LIST IS EMPTY, REFETCH BECAUSE WE HAVE NO DATA OF SERVICIOS
        if (listaServiciosLabel.length === 0) fetchServicios();
    }, []);


    const coleccionServiciosIsRdy = (Object.keys(coleccionServicios).length > 0);
    const coleccionServiciosPorIDIsRdy = (Object.keys(coleccionServiciosPorID).length > 0);
    const bothColeccionesAreRdy = (coleccionServiciosIsRdy && coleccionServiciosPorIDIsRdy)

    return (
    <>
        <article className={styles['servicios-solicitados-container']}>
            <table>
                <colgroup>
                    <col span={1} className={styles['table-column-codigo']}/>
                    <col span={1} className={styles['table-column-descripcion']}/>
                    <col span={1} className={styles['table-column-valorunitario']}/>
                    <col span={1} className={styles['table-column-cantidad']}/>
                    <col span={1} className={styles['table-column-valor']}/>
                </colgroup>

                <thead>
                    <tr>
                        <th colSpan={5}>Servicios solicitados</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Código</th>
                        <th>Descripcion</th>
                        <th>ValorUnitario</th>
                        <th>Cantidad</th>
                        <th>Valor</th>
                    </tr>
                    
                    {(!bothColeccionesAreRdy) 
                        ? <></>
                        :   <RowsCollection
                                listaServiciosLabel={listaServiciosLabel}
                                coleccionServicios={coleccionServicios}
                                coleccionServiciosPorID={coleccionServiciosPorID}
                                parentServSolicitadosArrSetter={parentServSolicitadosArrSetter}
                                parentServiciosSolicitadosArr={parentServiciosSolicitadosArr}
                            />
                    }

                </tbody>          
            </table>
        </article>
    </>
    )
};


//* -----------------------------------------------------------------------------
//* -----------------------------------------------------------------------------
//* -----------------------------------------------------------------------------
//* COMPONENTE COLECCION DE FILAS ESPECÍFICAS -----------------------------------

interface RowsCollectionProps {
    //* CON ESTO BUSCAMOS ACCEDER A CADA OBJECTO-SERVICIO DE FORMA RAPIDA: O(1)
    coleccionServicios: IServicioDataAccessObj
    coleccionServiciosPorID: IServicioIDDataAccessObj;
    listaServiciosLabel: labelServicios[];

    //* ESTA ES LA FUNCIÓN QUE EJECUTAREMOS CUANDO INTERACTUEN CON LOS BOTONES DE CAMBIAR PAGINA
    parentServSolicitadosArrSetter: Dispatch<SetStateAction<IServicioSolicitado[]>>;

    //* ESTO ES PARA QUE PODAMOS RECONSTRUIR LA LISTA DE FILAS AL VOLVER A LA PÁGINA
    parentServiciosSolicitadosArr: IServicioSolicitado[]
}


const RowsCollection: FC<RowsCollectionProps> = (propsObj) => {
    //* ESTE ES EL ARRAY DE SERVICIOS SOLICITADOS QUE QUEREMOS ENVIAR
    //* ES IMPORTANTE YA QUE EN BASE A LA CANTIDAD DE ELEMENTOS DE ESTA LISTA
    //* HACEMOS LA RENDERIZACIÓN DE LAS FILAS
    const [listaServiciosSolicitados, setListaSolicitados] = useState<IServicioSolicitado[]>([getEmptyServicioSolicitado()]);
    const [listaFilasJSX, setListaFilasJSX] = useState<JSX.Element[]>([]);

    //* We want to run a parent useState setter function when hovering certain element
    //* We only want to run it once, so this will help us.
    const [setterMounted, setSetterMounted] = useState<boolean>(false);

    const {
        coleccionServicios, coleccionServiciosPorID, 
        listaServiciosLabel,
        parentServiciosSolicitadosArr, parentServSolicitadosArrSetter} = propsObj;

    // * FUNCION QUE SE EJECUTA EN EL BOTON (+)
    const addNewNextServicioSolicitado = (rowIndex: number) => () => {
        if (rowIndex < 0) return;
        listaServiciosSolicitados.push(getEmptyServicioSolicitado());
        const proxyListaSolicitados = [...listaServiciosSolicitados];
        setListaSolicitados(proxyListaSolicitados);
        parentServSolicitadosArrSetter(proxyListaSolicitados);
    }

    // * FUNCION QUE SE EJECUTA EN EL BOTON (-)
    const removeCurrentServicioSolicitado = (rowIndex: number) => () => {
        if (rowIndex < 0) return;
        listaServiciosSolicitados.pop();
        const proxyListaSolicitados = [...listaServiciosSolicitados];
        setListaSolicitados(proxyListaSolicitados);
        parentServSolicitadosArrSetter(proxyListaSolicitados);
    }


    useEffect(() => {        
        const mountSaveListaSolicitadosFn = () => {
            const switcherContainer = document.getElementById(saveCotizacionesSwitcherID_container);
            if (switcherContainer) {
                switcherContainer.onmouseover = () => {
                    // alert("c");
                    parentServSolicitadosArrSetter(listaServiciosSolicitados);
                }
                setSetterMounted(true);
            }
        }
        
        
        const generateTableRows = (serviciosSolicitadosArr: IServicioSolicitado[]) => {            
            return serviciosSolicitadosArr.map((itemServicio, index) => {
                const servicioFila = serviciosSolicitadosArr[index];
                const servicioElegidoProp = (servicioFila.id in coleccionServiciosPorID) ? coleccionServiciosPorID[servicioFila.id].descripcion : null;
                
                return <ServicioSolicitadoRow 
                    key = {`servicio_solicitado_${index}`}
    
                    rowIndex={index}
                    servicioElegidoProp={servicioElegidoProp}
                    codigoValueProp={itemServicio.codigo}
                    // cantidadValueProp={itemServicio.cantidad}
                    cantidadValueProp={itemServicio.id}
                    
                    coleccionServicios={coleccionServicios} //* PARA ACCEDER A LOS DATOS USANDO EL NOMBRE
                    listaNombreServicios={listaServiciosLabel} //* PARA EL AUTO COMPLETE
                    listaServiciosSolicitados={serviciosSolicitadosArr} //* PARA ACCEDER A LO QUE SE ENVIARÁ
                    //* ACCEDEMOS AL OBJETO CORRECTO GRACIAS A (rowIndex: number)
                    
                    addNewRow={addNewNextServicioSolicitado(index)}
                    removeRow={removeCurrentServicioSolicitado(index)}
                />            
            })
        }
        
        const coleccionServiciosIsRdy = (Object.keys(coleccionServicios).length > 0);
        const coleccionServiciosPorIDIsRdy = (Object.keys(coleccionServiciosPorID).length > 0);
        const conditionsAreOK = (coleccionServiciosIsRdy) && (coleccionServiciosPorIDIsRdy);
        if (conditionsAreOK) {
            //* ONLY USE THE PARENT ARRAY IF WE SAVED A LOT OF ROWS
            if (parentServiciosSolicitadosArr.length > 1) {
                // alert("a");
                setListaFilasJSX(generateTableRows(parentServiciosSolicitadosArr));
            }else {
                // alert("b");
                setListaFilasJSX(generateTableRows(listaServiciosSolicitados));
            }
        }

        //* RUN THE FUNCTION ONLY ONCE
        if (!setterMounted) {
            mountSaveListaSolicitadosFn();
        }
    }, [listaServiciosSolicitados])

    return (
    <>
        {/* <button onClick={() => {console.log("\n\n", listaServiciosSolicitados)}}>listaServiciosSolicitados</button> */}
        {listaFilasJSX}
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
}

const ServicioSolicitadoRow: FC<ServicioSoliRowProp> = (propsObj) => {
    const {
        codigoValueProp, cantidadValueProp, servicioElegidoProp, rowIndex, 
        coleccionServicios, listaNombreServicios, listaServiciosSolicitados,
        addNewRow, removeRow } = propsObj;

    const [servicioElegido, setServicioElegido] = useState<string | null>('');
    const [codigoValue, setCodigoValue] = useState<string>('');
    const [cantidadValue, setCantidadValue] = useState<number>(0);
    
    const [servicioData, setServicioData] = useState<IServicioData>(getEmptyServicioDataObj());

    const [rowIsActive, setRowIsActive] = useState<boolean>(false);

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


    const setCodigoInputValue = (newCodigo: string) => {
        if (newCodigo !== '') {
        };
        listaServiciosSolicitados[rowIndex].codigo = newCodigo;
        setCodigoValue(newCodigo);
    }
    const setCantidadInputValue = (newCantidad: number) => {
        if (newCantidad >= 0) {
            listaServiciosSolicitados[rowIndex].cantidad = newCantidad;
            setCantidadValue(newCantidad);
        };
    }

    const setNewServicioElegido = (_: unknown, nuevoServicioElegido: string) => {
        if (!(nuevoServicioElegido in coleccionServicios)) {
            setServicioData(getEmptyServicioDataObj());
            setServicioElegido(null);
            return;
        };
        const servicioData = coleccionServicios[nuevoServicioElegido];
        listaServiciosSolicitados[rowIndex].id = servicioData.id;
        
        setServicioData(servicioData);
        setServicioElegido(nuevoServicioElegido);
    }
    
    return (
    <>
        <tr 
            className={styles['servicio-solicitado-row']}
            onMouseEnter={() => {
                setRowIsActive(true);
            }}
            onMouseLeave={() => {
                setRowIsActive(false);
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
                <h4>${servicioData.valor_unitario ?? '0'} c/u</h4>
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
                <h4>${servicioData.valor_unitario * cantidadValue}</h4>
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