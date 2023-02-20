import { AutoComplete } from 'antd';
import { ChangeEvent, FC, useRef, useState, useEffect, MutableRefObject, SetStateAction, Dispatch } from 'react';


import { DataRequester } from 'apiClient';
import styles from "./ClienteFrame.module.css";
import { getEmptyCotiValoresExtra, testIfRutIsValid } from "utils";
import { IClienteFrameProps, IValoresExtraCotizacion, IInputClienteDataEnviar, IClienteRutForAutocomplete } from "models";


export const ClienteFrame: FC<IClienteFrameProps> = ({clienteDataSetter}) => {
    const [listaRuts, setListaRuts] = useState<IClienteRutForAutocomplete[]>([]);
    const [rutIsValid, setRutIsValid] = useState<boolean>(false);
    const cotiValoresExtraRef = useRef<IValoresExtraCotizacion>(getEmptyCotiValoresExtra());
    // IInputClienteDataEnviar

    useEffect(() => {
        const fetchRutClientes = async () => {
            const rutsClientesArr = await DataRequester.getListaRutsForAutocomplete();            
            setListaRuts(rutsClientesArr);
        }
        fetchRutClientes();
    }, [rutIsValid]);

    const changeCotiValue = (cotiValoresExtraRef: MutableRefObject<IValoresExtraCotizacion>, propToModify: string) => (eObj: ChangeEvent<HTMLInputElement>) => {
        const rawNewValue = eObj.target.value;
        if (propToModify in cotiValoresExtraRef.current) {
            //? IF WE GET THIS FAR, IT MEANS THAT THE PROPERTY EXISTS IN THE OBJECT
            //? SO THERE'S NO PROBLEM IS WE USE as keyof OPERATORS
            const proxyPropToModify = propToModify as keyof IValoresExtraCotizacion;
            
        }
    }


    return (
    <>
        <article className={styles['cliente-main-container']}>
            <h3>Datos del cliente</h3>
            <RutInputRow  listaRuts={listaRuts} setRutIsValid={setRutIsValid}/>
            <ClientDataRow labelName='Nombre'    onChangeFn={() => {}} inputType='text'   disabled={rutIsValid} placeholderStr='Ingresar nombre del cliente'/>
            <ClientDataRow labelName='email'     onChangeFn={() => {}} inputType='email'  disabled={rutIsValid} placeholderStr='Ingresar email del cliente'/>
            <ClientDataRow labelName='Telefono'  onChangeFn={() => {}} inputType='number' disabled={rutIsValid} placeholderStr='Ingresar telefono del cliente'/>
            <ClientDataRow labelName='Direccion' onChangeFn={() => {}} inputType='email'  disabled={rutIsValid} placeholderStr='Ingresar dirección del cliente'/>
            <ClientDataRow labelName='Contacto'  onChangeFn={() => {}} inputType='email'  disabled={rutIsValid} placeholderStr='Ingresar contacto del cliente'/>
            <ClientDataRow labelName='FormaPago' onChangeFn={() => {}} inputType='email'  disabled={rutIsValid} placeholderStr='Ingresar forma de pago del cliente'/>
        </article>
        <button> IMPRIMIR DATOS</button>
    </>
    )
};


// //* ----------------- CUSTOM COMPONENTS ONLY FOR THIS FILE --------------------------


//* ------------------------- RUT INPUT ----------------------------------------
interface IRutInputRowProps {
    listaRuts: IClienteRutForAutocomplete[];
    setRutIsValid: Dispatch<SetStateAction<boolean>>
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
    const [rutValue, setRutValue] = useState('');
    const [rutResultClass, setRutResultClass] = useState<rutResultClass>('empty-rut-input');
    
    useEffect(() => {
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
    }, [rutValue]);

    const innerSetRutValue = (rutValueInput: unknown) => {
        if (typeof rutValueInput === 'string') {
            setRutValue(rutValueInput);   
            // HERE SET THE .current VALUE OF THE REF OBJECT
        }
    }

    return (
    <>
    <section className={`${styles['cliente-rut-input-row']}`}>
        <label><h4>Rut del cliente</h4></label>
        <AutoComplete
            options={inputProps.listaRuts}
            className={`${styles['autocomplete-limited-container']}`}
            onChange={(eObj) => innerSetRutValue(eObj)}
            >
            <input  
                className={`${styles['rut-input-box']}`}
                placeholder = 'Escriba el rut del cliente'
                type='text'
                value={rutValue}
                style={{borderColor:borderColorCollection[rutResultClass]}}
            />            
        </AutoComplete>
        <label style={{color:borderColorCollection[rutResultClass]}}> 
            {auxValidMessageCollection[rutResultClass]} 
        </label>
    </section>
    </>
    );
}





interface IInputRowProps {
    disabled: boolean;
    labelName: string;
    inputType: string;
    placeholderStr: string;
    // onChangeFn: (eObj: ChangeEvent<HTMLInputElement>) => void;
    onChangeFn: () => void;
}

const ClientDataRow: FC<IInputRowProps> = (inputProps) => {    
    return (
    <>
    <section className={`${styles['cliente-input-row']}`}>
        <label><h4>{inputProps.labelName}</h4></label>
        <input 
            className={`${styles['rut-input-box']}`}
            placeholder = {(inputProps.disabled) ? inputProps.placeholderStr : 'RUT no válido'}
            type={inputProps.inputType}
            // onChange={(eObj) => inputProps.onChangeFn(eObj)}
            onChange={(eObj) => inputProps.onChangeFn()}
            disabled = {!inputProps.disabled}
        />
    </section>
    </>
    );
}