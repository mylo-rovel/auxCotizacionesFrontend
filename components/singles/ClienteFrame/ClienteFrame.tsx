import { AutoComplete } from 'antd';
import { ChangeEvent, FC, useState, useEffect, SetStateAction, Dispatch } from 'react';

import { DataRequester } from 'apiClient';
import styles from "./ClienteFrame.module.css";
import { maximumLenghts, ultimoRutManagerObj } from "utils";
import { getEmptyCotiValoresExtra, getEmptyClienteData, testIfRutIsValid } from "utils";
import { update_CotiValoresObj_Value, updateCotizacionValoresExtra } from './ClienteFrameAux';
import { IClienteFrameProps, IValoresExtraCotizacion, IInputClienteDataEnviar, IClienteRutForAutocomplete, IClienteRut, IClienteIDPorRut } from "models";

export interface IValoresExtraYCliente extends IValoresExtraCotizacion, IInputClienteDataEnviar {}

const getEmptyValoresExtraYCliente = ():IValoresExtraYCliente => {
    return {
        ...getEmptyCotiValoresExtra(),
        ...getEmptyClienteData()
    }
}

export const ClienteFrame: FC<IClienteFrameProps> = ({parent_clientData, parent_clienteDataSetter, parent_cotiValExtaSetter, fechaCotizacion, parent_formaPago}) => {
    const [listaRuts_ID, setListaRuts_ID] = useState<IClienteRut[]>([]);
    
    const [listaRutsAutocomplete, setListaRutsAutocomplete] = useState<IClienteRutForAutocomplete[]>([]);
    const [diccionarioRuts_IDs, setDiccionarioRuts_IDs] = useState<IClienteIDPorRut>({});

    const [rutIsValid, setRutIsValid] = useState<boolean>(false);
    const [modificarClienteAntiguo, setModificarClienteAntiguo] = useState<boolean>(false);

    const [cotizacionValoresExtra, setCotizacionValoresExtra] = useState<IValoresExtraYCliente>(getEmptyValoresExtraYCliente());

    useEffect(() => {
        const setupMainObjectData = () => {
            //* DADO QUE NECESITAMOS SACAR EL MOUSE DEL CUADRITO PARA CAMBIAR DE PESTAÑA
            //* SIEMPRE GUARDAREMOS LOS DATOS            
            setCotizacionValoresExtra((prevState) => {
                const dummyClientDataJSON = JSON.stringify(getEmptyClienteData());
                const parentClientDataJSON = JSON.stringify(parent_clientData);                
                //* IF BOTH ARE EQUAL => parentClientDataJSON IS EMPTY
                //* SO WE DONT WANT TO UPDATE OUR OBJECT
                if (dummyClientDataJSON === parentClientDataJSON) {
                    return prevState;
                }
                return {
                    ...prevState,
                    fechaCotizacion,
                    nombre: parent_clientData.nombre,
                    rut: parent_clientData.rut,
                    email: parent_clientData.email,
                    telefono: parent_clientData.telefono,
                    direccion: parent_clientData.direccion,
                    contacto: parent_clientData.contacto,
                    formaPago: parent_formaPago
                }
            })            
            
        }
        const fetchRutClientes = async () => {
            const rutsClientesArr = await DataRequester.getListaRuts();
            setListaRuts_ID(rutsClientesArr);

            const rutsClientesAutocompleteArr: IClienteRutForAutocomplete[] = rutsClientesArr.map((clienteObj) => {
                return { value: clienteObj.rut }
            })
            setListaRutsAutocomplete(rutsClientesAutocompleteArr);

            const proxy_coleccionRuts_porID: IClienteIDPorRut = rutsClientesArr.reduce((accObj: IClienteIDPorRut, currCliente) => {
                //* RUT : ID_CLIENTE
                accObj[currCliente.rut] = currCliente.id;
                return accObj;
            }, {})
            setDiccionarioRuts_IDs(proxy_coleccionRuts_porID);
        }
        if (listaRuts_ID.length === 0) {fetchRutClientes();}
        
        //* DADO QUE NECESITAMOS SACAR EL MOUSE DEL CUADRITO PARA CAMBIAR DE PESTAÑA
        //* SIEMPRE GUARDAREMOS LOS DATOS
        setupMainObjectData();
    }, []);


    //TODO: GUARDAR DATOS
    //TODO: PREGUNTAR SI ESTÁ SEGURO DE QUE QUIERE MODIFICAR LOS DATOS
    //TODO: (SABEMOS QUE EL CLIENTE FUE MODIFICADO POR cotizacionValoresExtra.clienteEsNuevo)
    const saveClienteData = () => {
        if (rutIsValid){
            const clienteDataEnviar: IInputClienteDataEnviar = {
                id: 1,
                nombre: cotizacionValoresExtra.nombre,
                rut: cotizacionValoresExtra.rut.toUpperCase(),
                email: cotizacionValoresExtra.email,
                telefono: cotizacionValoresExtra.telefono,
                direccion: cotizacionValoresExtra.direccion,
                contacto: cotizacionValoresExtra.contacto,
                created_at: '',
                updated_at: ''
            };

            parent_clienteDataSetter(clienteDataEnviar);
            parent_cotiValExtaSetter((prevState) => {
                return {
                    ...prevState,
                    clienteEsNuevo: cotizacionValoresExtra.clienteEsNuevo,
                    idClienteSiEsViejo: cotizacionValoresExtra.idClienteSiEsViejo,
                    formaPago: cotizacionValoresExtra.formaPago,
                }
            });

            ultimoRutManagerObj.saveRutInLocalStorage(clienteDataEnviar.rut);
        }
    }
    
    return (
        <>
        {/* {JSON.stringify(cotizacionValoresExtra)} */}
        <article className={styles['cliente-main-container']} onMouseLeave={saveClienteData}>
            <article className={styles['cliente-main-container-header']}>
                <h3>Datos del cliente</h3>
                <section>
                    <h4>Fecha cotización: </h4>
                    <h3>{fechaCotizacion}</h3>
                </section>
            </article>
            <RutInputRow inputValueProp={cotizacionValoresExtra.rut} setModificarClienteAntiguo={setModificarClienteAntiguo} rutIsValid={rutIsValid} listaRutsAutocomplete={listaRutsAutocomplete} setRutIsValid={setRutIsValid}  diccionarioRuts_IDs={diccionarioRuts_IDs} setCotizacionValoresExtra={setCotizacionValoresExtra}/>
            <ClientDataRow labelName='Nombre'                       onChangeFn={update_CotiValoresObj_Value(setCotizacionValoresExtra, 'nombre')}    inputValueProp={cotizacionValoresExtra.nombre}      inputType='text'   disabled={modificarClienteAntiguo && rutIsValid} placeholderStr='Ingresar nombre del cliente'       />
            <ClientDataRow labelName='email'                        onChangeFn={update_CotiValoresObj_Value(setCotizacionValoresExtra, 'email')}     inputValueProp={cotizacionValoresExtra.email}       inputType='email'  disabled={modificarClienteAntiguo && rutIsValid} placeholderStr='Ingresar email del cliente'        />
            <ClientDataRow labelName='Telefono (ejemplo: 912341234)'onChangeFn={update_CotiValoresObj_Value(setCotizacionValoresExtra, 'telefono')}  inputValueProp={cotizacionValoresExtra.telefono}    inputType='number' disabled={modificarClienteAntiguo && rutIsValid} placeholderStr='Ingresar telefono del cliente'     />
            <ClientDataRow labelName='Direccion'                    onChangeFn={update_CotiValoresObj_Value(setCotizacionValoresExtra, 'direccion')} inputValueProp={cotizacionValoresExtra.direccion}   inputType='text'   disabled={modificarClienteAntiguo && rutIsValid} placeholderStr='Ingresar dirección del cliente'    />
            <ClientDataRow labelName='Contacto'                     onChangeFn={update_CotiValoresObj_Value(setCotizacionValoresExtra, 'contacto')}  inputValueProp={cotizacionValoresExtra.contacto}    inputType='text'   disabled={modificarClienteAntiguo && rutIsValid} placeholderStr='Ingresar contacto del cliente'     />
            <ClientDataRow labelName='FormaPago (ejemplo: efectivo)'onChangeFn={update_CotiValoresObj_Value(setCotizacionValoresExtra, 'formaPago')} inputValueProp={cotizacionValoresExtra.formaPago}   inputType='text'   disabled={modificarClienteAntiguo && rutIsValid} placeholderStr='Ingresar forma de pago del cliente'/>
        </article>
    </>
    )
};




// //* ----------------- CUSTOM COMPONENTS ONLY FOR THIS FILE --------------------------



// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
//* ------------------------- RUT INPUT ----------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

interface IRutInputRowProps {
    rutIsValid: boolean;
    setRutIsValid: Dispatch<SetStateAction<boolean>>;
    setModificarClienteAntiguo: Dispatch<SetStateAction<boolean>>;
    
    listaRutsAutocomplete: IClienteRutForAutocomplete[];
    diccionarioRuts_IDs: IClienteIDPorRut;

    setCotizacionValoresExtra: Dispatch<SetStateAction<IValoresExtraYCliente>>;

    inputValueProp: string;
};

type rutResultClass = 'valid-rut' | 'invalid-rut' | 'empty-rut-input';

type rutResultConversion = {
    [key in rutResultClass]: string;
}

const auxValidMessageCollection: rutResultConversion = {
    'empty-rut-input': '',
    'invalid-rut': 'Rut inválido',
    'valid-rut': 'Rut válido'
}

const borderColorCollection: rutResultConversion = {
    'empty-rut-input': 'black',
    'invalid-rut': 'red',
    'valid-rut': 'green'
}

const RutInputRow: FC<IRutInputRowProps> = (inputProps) => {
    const [ultimoRutIngresado, setUltimoRutIngresado] = useState<string>('');
    const [rutValue, setRutValue] = useState<string>('');
    const [rutResultClass, setRutResultClass] = useState<rutResultClass>('empty-rut-input');
    
    useEffect(() => {
        const setupUltimoRutGuardado = () => {
            const ultimoRut = ultimoRutManagerObj.getUltimoRut_localStorage();
            setUltimoRutIngresado(ultimoRut);
        }

        const rutIsValid = testIfRutIsValid(rutValue);
        if (rutValue === '') { 
            setRutResultClass('empty-rut-input');
            inputProps.setRutIsValid(false);
        }
        else if (rutIsValid) { 
            setRutResultClass('valid-rut');
            inputProps.setRutIsValid(true);
        }
        else { 
            setRutResultClass('invalid-rut');
            inputProps.setRutIsValid(false);
        }        
        
        if (inputProps.inputValueProp !== '') {
            setRutValue(inputProps.inputValueProp);
        }

        setupUltimoRutGuardado();
    }, [rutValue]);

    const fetchClienteDataPorRut = async (rutCliente: string) => {
        const datosCliente = await DataRequester.getDatosClientePorRut(rutCliente);
        updateCotizacionValoresExtra(datosCliente, inputProps.setCotizacionValoresExtra);
    }
    
    const innerSetRutValue = (rutValueInput: unknown) => {
        if (typeof rutValueInput === 'string') {
            //* NO GUARDAR RUTS DEMASIADO LARGOS
            if (rutValueInput.length > maximumLenghts.maxRutLength) return;
            
            if (rutValueInput in inputProps.diccionarioRuts_IDs){
                //* WE SET THE RUT IN THE FUNCTION updateCotizacionValoresExtra
                fetchClienteDataPorRut(rutValueInput);                
            }else {
                //* IF IS NOT ALREADY SAVED RUT, JUST USE TELL THAT THE CLIENT IS NEW
                inputProps.setCotizacionValoresExtra((prevState) => ({...prevState, 
                    rut:rutValueInput, clienteEsNuevo:true, idClienteSiEsViejo:1
                }));
            };
            setRutValue(rutValueInput);
        };
    };

    const switchModifyClienteFlag = () => inputProps.setModificarClienteAntiguo((prevState) => !prevState);

    const ModificarClienteButton = () => {
        if (!inputProps.rutIsValid) return <></>;
        return (
        <>
            <div></div>
            <button className={`${styles['cliente-rut-input-button']}`} onClick={switchModifyClienteFlag}>
                Modificar cliente
            </button>
        </>)
    }

    const ValidRutLabel = () => {
        return (
        <>
            <div></div>
            <label style={{color:borderColorCollection[rutResultClass]}}> 
                {auxValidMessageCollection[rutResultClass]} 
            </label>
        </>)
    }
    return (
    <>
    <article className={`${styles['cliente-rut-input-row']}`}>
        <section>
            <label><h3>Rut del cliente</h3></label>
            <label><h4>Ultimo rut escrito: {ultimoRutIngresado}</h4></label>
            <AutoComplete
                options={inputProps.listaRutsAutocomplete}
                className={`${styles['autocomplete-limited-container']}`}
                onChange={(eObj) => innerSetRutValue(eObj)}
                // value={{label: rutValue}}
                >
                <input  
                    className={`${styles['rut-input-box']}`}
                    placeholder = 'Escriba el rut del cliente'
                    type='text'
                    value={rutValue}
                    style={{borderColor:borderColorCollection[rutResultClass]}}
                />
            </AutoComplete>
        </section>
        
        <section className={`${styles['cliente-rut-input-left-section']}`}>
            
            <section className={`${styles['cliente-rut-input-left-element']}`}>
                <ValidRutLabel/>
            </section>

            <section className={`${styles['cliente-rut-input-left-element']}`}>
                <ModificarClienteButton/>
            </section>
        </section>
    </article>
    </>
    );
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
//* ------------------------- EACH OTHER ROW -----------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------


interface IInputRowProps {
    disabled: boolean;
    labelName: string;
    inputType: 'text' | 'number' | 'email';
    placeholderStr: string;
    
    onChangeFn: (eObj: ChangeEvent<HTMLInputElement>) => void;
    inputValueProp: string | number;
}

const ClientDataRow: FC<IInputRowProps> = (inputProps) => {
    const [dataRowValue, setDataRowValue] = useState<string | number>('');
    const [rowIsDisabled, setRowIsDisabled] = useState<boolean>(true);

    useEffect(() => {
        setRowIsDisabled(!rowIsDisabled);
        setDataRowValue(inputProps.inputValueProp);
    },[inputProps.disabled, inputProps.inputValueProp])

    
    const changeInputBoxValue = (eObj: ChangeEvent<HTMLInputElement>) => {        
        const rawInputValue = eObj.target.value;
        if (inputProps.inputType === 'number') {
            const numberedProp = Number(rawInputValue);
            if ((numberedProp >= 0) && (rawInputValue.length <= maximumLenghts.maxTelefonoLength)) {
                setDataRowValue(numberedProp);
                inputProps.onChangeFn(eObj);
            }
        }else {            
            setDataRowValue(rawInputValue);
            inputProps.onChangeFn(eObj);
        }
    }

    const placeholderValue = (inputProps.disabled) ? 'Escribir' : 'RUT no válido';

    return (
    <>
    <section className={`${styles['cliente-input-row']}`}>
        <label><h4>{inputProps.labelName}</h4></label>
        {
        (!inputProps.disabled) 
        ?   <h4>{dataRowValue}</h4> 
        :   <input 
                className={`${styles['rut-input-box']}`}
                placeholder = {placeholderValue}
                type={inputProps.inputType}
                onChange={changeInputBoxValue}
                disabled = {!inputProps.disabled}
                // disabled={rowIsDisabled}
                required
                value={dataRowValue}
            />
        }
    </section>
    </>
    );
}