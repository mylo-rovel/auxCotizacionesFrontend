import Calendar from 'react-calendar';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { FC, useState, useEffect, SetStateAction, Dispatch, useContext, CSSProperties } from 'react';

import { DataRequester } from 'apiClient';
import { TrabajosContext } from "context/trabajos";
import { BotonesFinales_Mas_Menos } from './AuxComponents';
import styles from "./ServiciosSolicitadosFrame.module.css"
import { PortaledModal } from '../PortaledModal/PortaledModal';
import { getEmptyServicioSolicitado, getValidDateString } from 'utils';
import { getFechaBonitaParaMostrar } from '../../../utils/generalFunctions/generalFunctions';
import { 
    IServicioData, IServiciosSolicitadosFrameProps, 
    IServicioSolicitado, IServicioDataAccessObj, IServicioIDDataAccessObj
} from "models";


export type labelServicios = { label: string };

export const ServiciosSolicitadosFrame: FC<IServiciosSolicitadosFrameProps> = ({ parentServSolicitadosArrSetter, parentServiciosSolicitadosArr }) => {
    const { 
        fechaTrabajoEscogida, updateFechaTrabajoEscogida, 
        prevFechaTrabajoEscogida, updatePrevFechaTrabajoEscogida,
        displayCalendar, setDisplayCalendarModal, 
        updateTrabajosList } = useContext(TrabajosContext);
    
    useEffect(() => {
        if (fechaTrabajoEscogida === '') {
            const todayDateObj = new Date();
            updateFechaTrabajoEscogida(getValidDateString(todayDateObj));
        }
        const fetchServicios = async () => {
            if (prevFechaTrabajoEscogida === fechaTrabajoEscogida) return;
            const serviciosArr = await DataRequester.getListaServicios(fechaTrabajoEscogida);
            updateTrabajosList(serviciosArr);
            updatePrevFechaTrabajoEscogida(fechaTrabajoEscogida);
            parentServSolicitadosArrSetter([{id:-1}]);
        }
        fetchServicios();
    }, [fechaTrabajoEscogida]);

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
        {/* {JSON.stringify({parentServiciosSolicitadosArr})} */}
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
                        <th 
                            onClick = {() => setDisplayCalendarModal(true)}
                            colSpan={5}
                            className={styles['the-very-title-of-the-table']}
                        >
                            Trabajos del día {getFechaBonitaParaMostrar(fechaTrabajoEscogida)}
                        </th>
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













//* -----------------------------------------------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------------------------------------------
//* COMPONENTE COLECCION DE FILAS DE LA TABLA -----------------------------------------------------------------------------------------

interface TableBodyRowsCollectionProps {
    //* ESTA ES LA FUNCIÓN QUE EJECUTAREMOS CUANDO INTERACTUEN CON LOS BOTONES DE CAMBIAR PAGINA
    parentServSolicitadosArrSetter: Dispatch<SetStateAction<IServicioSolicitado[]>>;

    //* EN ESTA LISTA GUARDAMOS LOS SERVICIOS SOLICITADOS A ENVIAR
    parentServiciosSolicitadosArr: IServicioSolicitado[]
}


const TableBodyRowsCollection: FC<TableBodyRowsCollectionProps> = (propsObj) => {
    const { parentServiciosSolicitadosArr, parentServSolicitadosArrSetter } = propsObj;
    const { fechaTrabajoEscogida, updateFechaTrabajoEscogida, listaTrabajos } = useContext(TrabajosContext);
    
    //* -----------------------------------------------------------------------------------------
    //* {ID TRABAJO : DATOS DEL TRABAJO}       USADO AL GENERAR LAS FILAS DE LA TABLA
    const [dict_IdTrabajo_DatosTrabajo, setDict_IdTrabajo_DatosTrabajo] = useState<IServicioIDDataAccessObj>({});
    //* -----------------------------------------------------------------------------------------
    //* {ID TRABAJO : DATOS DEL TRABAJO}       USADO EN EL AUTOCOMPLETAR
    const [dict_NombreTrabajo_DatosTrabajo, setDict_NombreTrabajo_DatosTrabajo] = useState<IServicioDataAccessObj>({});
    //* -----------------------------------------------------------------------------------------


    //* JUST FOR THE RERENDERING
    const setAmountOfRows = useState<number>(0)[1];

    //* USADO PARA MOSTRAR O NO EL MODAL PARA ELEGIR TRABAJO PARA LA FILA CLICKEADA
    const [displayModalTrabajoElegir, setDisplayModalTrabajoElegir] = useState<boolean>(false);

    //* USADO PARA TENER LA REFERENCIA DE LA FILA QUE FUE CLICKEADA
    const [currentIndexToModify, setCurrIndexToModify] = useState<number>(-1);


    useEffect(() => {
        if (fechaTrabajoEscogida === '') {
            const todayDateObj = new Date();
            updateFechaTrabajoEscogida(getValidDateString(todayDateObj));
        }

        const setupListasTrabajo = async () => {
            //* SI EN EL DÍA ESCOGIDO NO HAY TRABAJOS, POS NO PODEMOS HACER ALGO UTIL CON UN []
            if (listaTrabajos.length === 0) return;
            
            // TODO: PUNTO OPTIMIZABLE => RECORREMOS LA MISMA LISTA 2 VECES
            const coleccionTrabajosObjPorID: IServicioIDDataAccessObj = listaTrabajos.reduce((acc: IServicioIDDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.id] = servicioDataObj;
                return acc;
            }, {})
            setDict_IdTrabajo_DatosTrabajo(coleccionTrabajosObjPorID);

            const coleccionTrabajosObjPorNombre: IServicioDataAccessObj = listaTrabajos.reduce((acc: IServicioDataAccessObj, servicioDataObj) => {
                acc[servicioDataObj.detalle_servicio] = servicioDataObj;
                return acc;
            }, {})
            setDict_NombreTrabajo_DatosTrabajo(coleccionTrabajosObjPorNombre);
        }

        setupListasTrabajo();
    
    //* SINCE WE HAVE TO USE THE MOST UPDATED listaTrabajos, WE WILL LISTEN TO CHANGES
    //* OF THAT VARIABLE ==> BETTER THAN LISTEN TO fechaTrabajoEscogida    
    //* WE HAVE NO BUSINESS WITH fechaTrabajoEscogida DIRECTLY AS WE DO WITH listaTrabajos
    }, [listaTrabajos]);


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
        if (rowIndex <= 0) return;
        const proxyListaSolicitados = [...parentServiciosSolicitadosArr];
        proxyListaSolicitados.pop();

        parentServSolicitadosArrSetter(proxyListaSolicitados);

        //* PARA EJECUTAR EL useEffect
        setAmountOfRows(proxyListaSolicitados.length);
    }


    const modalTrabajoElegirButtonFn = () => { setDisplayModalTrabajoElegir(false); }
    const ModalElegirTrabajo = () => {
        if (!displayModalTrabajoElegir) return <></>;
        if (currentIndexToModify >= parentServiciosSolicitadosArr.length) return <></>;

        const listaOpciones = listaTrabajos.map((item) => ({label: item.detalle_servicio}));

        const updateParentList = (_: unknown, rawNewTrabajo: string) => {
            const trabajoData = dict_NombreTrabajo_DatosTrabajo[rawNewTrabajo];
            if (!trabajoData) return;            
            const proxyParentList = [... parentServiciosSolicitadosArr];
            proxyParentList[currentIndexToModify].id = trabajoData.id;
            parentServSolicitadosArrSetter(proxyParentList);
            setDisplayModalTrabajoElegir(false);
            setCurrIndexToModify(-1)
        }
        return (
        <>
            <PortaledModal contentIsNotOnlyText={true} buttonText='CERRAR' buttonFn={modalTrabajoElegirButtonFn}>
                <article className={styles['modify-row-trabajo-portal-frame']}>  
                    <h3>Modificando trabajo elegido de la fila {currentIndexToModify+1}</h3>
                    <Autocomplete 
                        options={listaOpciones} 
                        renderInput={(params) => <TextField {...params} label="" />} 
                        onInputChange={updateParentList}
                    /> 
                </article>
            </PortaledModal>
        </>)
    }




    const toggleDisplayModalElegirTrabajo = (rowIndex: number) => () => {
        setCurrIndexToModify(rowIndex);
        setDisplayModalTrabajoElegir(true);
    }
    const FilasTabla = () => {
        if (parentServiciosSolicitadosArr.length === 0) return <></>;
        
        // //* WE WANT TO CHECK IF THE ROWS MATCH THE SELECTED DAY
        // const testElement = dict_IdTrabajo_DatosTrabajo[parentServiciosSolicitadosArr[0].id];
        // if (!testElement) return <></>;
        // if (testElement.created_at !== fechaTrabajoEscogida) return <></>;

        return (
        <>{
        parentServiciosSolicitadosArr.map((trabajoEnviar, index) => {
            //* Empty object IServicioData
            let trabajoEscogido: IServicioData = { id: -1, codigo: '-', detalle_servicio: '-', equipo: '-', info_adicional: '-', valor: 0, created_at: '-', updated_at: '-', fecha_realizacion: '-', };
            
            if (dict_IdTrabajo_DatosTrabajo[trabajoEnviar.id]) trabajoEscogido = dict_IdTrabajo_DatosTrabajo[trabajoEnviar.id];
            
            return <ServicioSolicitadoRow key = {`servicio_solicitado_${index}`}                
                trabajoEscogido = {trabajoEscogido}
                rowCharacteristics = {{
                    rowIsLastOne: (index === parentServiciosSolicitadosArr.length-1),
                    shouldDisplayMinusButton: index !== 0                    
                }}
                
                addNewRow={addNewNextServicioSolicitado(index)}
                removeRow={removeCurrentServicioSolicitado(index)}

                toggleDisplayModalElegirTrabajo = {toggleDisplayModalElegirTrabajo(index)}
                />
        })
        }</>)
    }

    return (
    <>      
        <ModalElegirTrabajo/>
        <FilasTabla/>
    </>
    )
};





//* -----------------------------------------------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------------------------------------------
//* COMPONENTE CADA FILA ESPECÍFICA ---------------------------------------------------------------------------------------------------

interface ServicioSoliRowProp {    
    trabajoEscogido: IServicioData;

    rowCharacteristics: {
        rowIsLastOne: boolean;
        shouldDisplayMinusButton: boolean;
    }
    
    addNewRow: () => void;  //* FUNCIÓN DEL BOTON (+)
    removeRow: () => void;  //* FUNCIÓN DEL BOTON (-)
    
    toggleDisplayModalElegirTrabajo: () => void
}

const ServicioSolicitadoRow: FC<ServicioSoliRowProp> = (propsObj) => {
    const [mouseIsOverRow, setMouseIsOverRow] = useState<boolean>(false);
    const {
        trabajoEscogido, //* DATOS QUE MOSTRAREMOS
        rowCharacteristics,
        addNewRow, removeRow, //* PARA DARLE FUNCIONALIDAD A LOS BOTONES (+) Y (-)
        toggleDisplayModalElegirTrabajo,
    } = propsObj;
    //* -----------------------------------------------------------------------------------------------------------------------------------------------------------

    const styleObj: CSSProperties = {borderColor: 'red', opacity: 0.95, transition: 'all 0.1s'};
    const commonStyleObjToUse = (mouseIsOverRow) ? styleObj : {}

    return (
    <>
        <tr 
        onMouseEnter={() => setMouseIsOverRow(true)}
        onMouseLeave={() => setMouseIsOverRow(false)}
        className={styles['servicio-solicitado-row']}
        >
            <td className={styles['table-cell-codigo']} onClick={() => {toggleDisplayModalElegirTrabajo();}} style={commonStyleObjToUse}>
                <div><h4>{trabajoEscogido.codigo}</h4></div>
            </td>
            <td className={styles['table-cell-detalletrabajo']} onClick={() => {toggleDisplayModalElegirTrabajo();}} style={commonStyleObjToUse}>
                <div><h4>{trabajoEscogido.detalle_servicio}</h4></div>
            </td>
            <td className={styles['table-cell-equipo']} onClick={() => {toggleDisplayModalElegirTrabajo();}} style={commonStyleObjToUse}>
                <div><h4>{trabajoEscogido.equipo}</h4></div>
            </td>
            <td className={styles['table-cell-infoadicional']} onClick={() => {toggleDisplayModalElegirTrabajo();}} style={commonStyleObjToUse}>
                <div><h4>{trabajoEscogido.info_adicional}</h4></div>
            </td>
            <td className={styles['table-cell-valor']} onClick={() => {toggleDisplayModalElegirTrabajo();}} style={commonStyleObjToUse}>
                <div><h4>${trabajoEscogido.valor}</h4></div>
            </td>
            
            <BotonesFinales_Mas_Menos
                rowCharacteristics={rowCharacteristics}
                addNewRow = {addNewRow}
                removeRow = {removeRow}
                styles = {styles}
            />
        </tr>
    </>
    )
};