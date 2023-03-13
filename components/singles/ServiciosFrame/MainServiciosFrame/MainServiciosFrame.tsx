import { TextField } from '@mui/material';
import { FC, useState, useEffect, useContext, useRef, Dispatch, SetStateAction } from 'react';

import { maximumLenghts } from 'utils';
import { DataRequester } from 'apiClient';
import { TrabajosContext } from "context/trabajos";
import styles from './MainServiciosFrame.module.css';
import { IMainServiciosFrameProps, INewTrabajo, newTrabajo_prop } from 'models';
import { guardarTrabajo, generateEmptyNewTrabajo, defaultTrabajo_INITIAL_ID, getFechaBonitaParaMostrar } from 'utils';

// ---------------------------------------------------------------
// ---------------------------------------------------------------

export const MainServiciosFrame: FC<IMainServiciosFrameProps> = (props) => {
    const { setResultadoPeticion, setDisplayModalResultado } = props;
    const { fechaTrabajoEscogida, setDisplayCalendarModal, updateIDTrabajoModificar } = useContext(TrabajosContext);    

    //* THIS WAY, WE WILL REACH AN SPECIFIC POINT OF THE CuerpoGuardarTrabajo useEffect CODE
    //* WHICH WILL INDEED, RESET ALL THE FIELDS AND THE
    const limpiarInputs = () => { 
        updateIDTrabajoModificar(-2);
    }

    return <>
    <article className={styles['main-frame-container']}>
        
        <article className={`${styles['header-container']}`}>
            <section className={`${styles['cambiar-fecha-button-container']}`}>
                {/* <button onClick={() => {setDisplayCalendarModal(true)}}>
                    <h4>CAMBIAR FECHA</h4>
                </button> */}
            </section>

            <section className={styles['main-frame-title-container']}>
                <h1 onClick={() => setDisplayCalendarModal(true)}>{getFechaBonitaParaMostrar(fechaTrabajoEscogida)}</h1>
            </section>

            <section className={`${styles['cambiar-fecha-button-container']}`}>
                <button onClick={() => {limpiarInputs()}}>
                    <h4>Reiniciar campos</h4>
                </button>
            </section>
        </article>

        <CuerpoGuardarTrabajo setDisplayModalResultado={setDisplayModalResultado} setResultadoPeticion={setResultadoPeticion}/>

    </article>
    </>
};

//* ---------------------------------------------------------------------------------
//* SPECIFIC COMPONENTS FOR THIS FRAME ----------------------------------------------
//* ---------------------------------------------------------------------------------

interface CuerpoGuardarTrabajoProps {
    setDisplayModalResultado: Dispatch<SetStateAction<boolean>>
    setResultadoPeticion: Dispatch<SetStateAction<string>>;
}

const CuerpoGuardarTrabajo:FC<CuerpoGuardarTrabajoProps> = (props) => {
    const { setDisplayModalResultado, setResultadoPeticion } = props;

    //* NECESITAMOS updateIDTrabajoModificar PARA RERENDERIZAR Y HACER UN NUEVO FETCH A LOS TRABAJOS
    const { idTrabajoModificar, fechaTrabajoEscogida, updateIDTrabajoModificar } = useContext(TrabajosContext);
    const [previousIDModificar, setPrevIDModificar] = useState<number>(defaultTrabajo_INITIAL_ID);
    const newTrabajoObjREF = useRef<INewTrabajo>(generateEmptyNewTrabajo());
    
    useEffect(() => {
        const fetchTrabajoPorID = async (idTrabajoModificar: number) => {
            //* LUEGO DE APRETAR "GUARDAR" AL USAR UN TRABAJO YA CREADO, ESTO 
            //* VOLVERÁ A CORRER. COMO LA ID NUEVA ES DISTINTA A previousIDModificar
            //* ESTARIAMOS HACIENDO OTRO FETCH QUE DEVOLVERÍA UN ERROR (ya que la ID es -1)
            if (idTrabajoModificar === -1) {
                newTrabajoObjREF.current = generateEmptyNewTrabajo();
            }else {
                const trabajoEncontrado = await DataRequester.getTrabajoPorID(idTrabajoModificar);
                if (!trabajoEncontrado) return;

                //* ACTUALIZAR EL OBJETO QUE TENEMOS
                newTrabajoObjREF.current = {
                    id: trabajoEncontrado.id,
                    detalle_servicio: trabajoEncontrado.detalle_servicio,
                    codigo: trabajoEncontrado.codigo,
                    equipo: trabajoEncontrado.equipo,
                    info_adicional: trabajoEncontrado.info_adicional,
                    valor: trabajoEncontrado.valor
                }
            }
            //* COMO ESTA FUNCIÓN ES ASYNC, LA ACTUALIZACIÓN DE ESTE OBJETO NO OCURRE
            //* EN EL INSTANTE EN EL QUE ESCRIBIMOS.
            //* => PARA QUE SE ACTUALICE, DEBEMOS USAR UN SETTER DE useState PARA 
            //*    CAUSAR UN RERENDER YA QUE LA INFO QUE USAMOS NO SE ESTÁ ACTUALIZANDO 
            //*    CUANDO QUEREMOS
            //TODO: RECORDAR QUE ESTE SETTER AYUDA A QUE RERENDERICEMOS PARA TENGAMOS
            //TODO: DISPONIBLE LA NUEVA INFO DE newTrabajoObjREF.current QUE ESCRIBIMOS ARRIBA
            setPrevIDModificar(idTrabajoModificar);
        }
        
        //* PARA REINICIAR LOS CAMPOS, DEJAMOS EJECUTAMOS ESTO:
        //*   updateIDTrabajoModificar(-2);
        //* ==> ASÍ RERENDERIZAMOS TODO Y LLEGAMOS A ESTA CONDICIONAL (-2 < -1) true
        if (idTrabajoModificar < -1){
            newTrabajoObjREF.current = generateEmptyNewTrabajo();
            setPrevIDModificar(idTrabajoModificar);
            updateIDTrabajoModificar(-1);
        }
        else if ((idTrabajoModificar !== previousIDModificar)){
            fetchTrabajoPorID(idTrabajoModificar);
        };
    },[idTrabajoModificar])

    const updateTrabajoProp = (prop: newTrabajo_prop, isNumber: boolean = false) => (rawNewValue: string): string => {
        //* Even when the values are the same, the reference is not => is a new whole object
        const proxyObjToUse = { ...newTrabajoObjREF.current };
        if (isNumber) {
            const newNumberValue = Number(rawNewValue);            
            if ((newNumberValue >= 0) && (rawNewValue.length < maximumLenghts.maxValorLength)){
                proxyObjToUse[prop] = newNumberValue;
            }
        }else {
            proxyObjToUse[prop] = rawNewValue;
        }
        // setNewTrabajoObj(proxyObjToUse);
        newTrabajoObjREF.current = {...proxyObjToUse};
        return String(proxyObjToUse[prop]);
    }

    //TODO: REMEMBER THIS
    //? "RECALCULATING" THE COMPONENT
    //* THIS WAY, WE CAN UPDATE THE CHILD COMPONENTS AND ITS VALUES WHICH ARE BASED ON
    //* THE newTrabajoObjREF.current OBJECT ==> WE NEED A RERENDER OF THIS PARENT COMPONENT
    //* TO PASS DOWN THE UPDATED VERSION OF newTrabajoObjREF.current
    const FilasInput = () => {
        return (
        <>
            <FilaInputNewTrabajo filaLabelName='Detalle trabajo'        parentValue={newTrabajoObjREF.current['detalle_servicio']}  updaterFunction={updateTrabajoProp('detalle_servicio')}   placeholder='Escriba qué hizo'                                />
            <FilaInputNewTrabajo filaLabelName='Equipo'                 parentValue={newTrabajoObjREF.current['equipo']}            updaterFunction={updateTrabajoProp('equipo')}             placeholder='Escriba en qué equipo trabajó'                   />
            <FilaInputNewTrabajo filaLabelName='Codigo'                 parentValue={newTrabajoObjREF.current['codigo']}            updaterFunction={updateTrabajoProp('codigo')}             placeholder='Escriba el código asociado'                      />
            <FilaInputNewTrabajo filaLabelName='Información adicional'  parentValue={newTrabajoObjREF.current['info_adicional']}    updaterFunction={updateTrabajoProp('info_adicional')}     placeholder='Agregue información adicional sobre el trabajo'  />
            <FilaInputNewTrabajo filaLabelName='Valor'                  parentValue={newTrabajoObjREF.current['valor']}             updaterFunction={updateTrabajoProp('valor', true)}        placeholder='Ingrese el valor que deseado'                    />
        </>);
    }
    
    const ModoActualTitle = () => {
        type modoOpcion = 'Creando' | 'Modificando';
        const modoActual: modoOpcion = (idTrabajoModificar <= -1) ? 'Creando' : 'Modificando'
        const colorModoActual = (modoActual === 'Creando') ? 'green' : 'yellow';

        return (
        <>
            <section className={`${styles['modo-actual-title-container']}`}>
                <h2 style={{borderColor: colorModoActual}}>{modoActual} registro de trabajo</h2>
                {/* <h2 style={{border: 0}}>ID trabajo: {Math.max(idTrabajoModificar, -1)}</h2>                 */}
                <h2 style={{border: 0}}>ID trabajo: {(idTrabajoModificar < 1) ? '-' : idTrabajoModificar}</h2>                
            </section>
        </>)
    }

    return (
    <>   
        <ModoActualTitle/>

        <FilasInput />

        <div className={`${styles['bottom-buttons-container']}`}>
            <div className={`${styles['save-service-button-container']}`}>
                <button onClick={() => {guardarTrabajo({
                    servicioGuardar: newTrabajoObjREF.current, 
                    fecha_realizacion: fechaTrabajoEscogida, 
                    setDisplayResultadoModal: setDisplayModalResultado, 
                    setResultadoPeticion, 
                    updateIDTrabajoModificar
                })}}>
                    <h4>GUARDAR</h4>
                </button>
            </div>
        </div>
    </>
    )
}

interface FilaInputNewTrabajoProps {
    updaterFunction: (rawNewValue: string) => string;
    filaLabelName: string;
    placeholder: string;
    
    parentValue: string | number;
}


const FilaInputNewTrabajo:FC<FilaInputNewTrabajoProps> = (props) => {
    const {updaterFunction, filaLabelName, placeholder, parentValue} = props;
    const [inputValue, setInputValue] = useState('');
    
    useEffect(() => {
        // console.log("rendering", filaLabelName, parentValue, inputValue, (filaLabelName === 'Valor') ? '\n\n\n' : '');
        setInputValue(String(parentValue));
    },[])

    const inputSetter = (rawNewValue: string) => {
        const valueToUse = updaterFunction(rawNewValue);
        setInputValue(valueToUse);
    }
    return (
    <>  
        <section className={`${styles['new_trabajo-input-container']}`}>
            <TextField                
                fullWidth
                label={filaLabelName}
                placeholder={placeholder}
                // autoFocus

                value={inputValue}
                onChange={(eObj) => {inputSetter(eObj.target.value)}}
                onBlur={() => {}}
                
                multiline
                sx={{marginTop: '1rem'}}
            />
        </section>
    </>
    )
}