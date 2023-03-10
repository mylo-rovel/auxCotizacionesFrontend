import { 
    IServicioData, IProviderData, IRawProviderData,
    IServicioBodyRequestFormat, 
    IClienteRut, IInputClienteDataEnviar, ICotizacionEnviar
} from "models";
import { getEmptyClienteData } from "utils";

type httpMethodOption = 'get' | 'post' | 'put' | 'patch' | 'delete';

export class DataRequester {
    private static baseServerURL = "http://localhost:4000/api/data";

    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //* GET INFO -----------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------

    public static async getProviderData(): Promise<IProviderData> {
        const objToReturn: IProviderData = {
            Razon_social: "Error en la request",
            Rut: "Error en la request",
            Giro: "Error en la request",
            Direccion: "Error en la request",
            Telefono: 0,
            Email: "Error en la request",
            Ciudad: "Error en la request",
        }
        const urlToFetch = `${DataRequester.baseServerURL}/proveedor`;
        try {
            const fetchedData: IRawProviderData = await fetch(urlToFetch)
                .then(data => data.json())
                .then(data => data[0]);
            objToReturn.Razon_social = fetchedData.razon_social;
            objToReturn.Rut = fetchedData.rut;
            objToReturn.Giro = fetchedData.giro;
            objToReturn.Direccion = fetchedData.direccion;
            objToReturn.Telefono = fetchedData.telefono;
            objToReturn.Email = fetchedData.email;
            objToReturn.Ciudad = fetchedData.ciudad;
        }
        catch {
            // console.log("DataRequester getProviderData error")
        }
        finally {
            return objToReturn
        }
    }


    public static async getListaRuts(): Promise<IClienteRut[]> {
        const urlToFetch = `${DataRequester.baseServerURL}/clientes/`;
        try {
            const fetchedData: IClienteRut[] = await fetch(urlToFetch).then(data => data.json());
            //* SI ENVIAMOS UN RUT VACIO, EN EL BACKEND GUARDAREMOS `idCliente_${id}`
            //*     ===> SI ES RUT REAL, EL PRIMER INDICE ES UN N??MERO MAYOR A 0
            console.log()
            return fetchedData.filter((cliente) => {
                //* CHEQUEAR SI EL RUT EST?? VAC??O
                if (cliente.rut === '') return false;
                //* CHEQUEAR SI EL PRIMER D??GITO ES UN N??MERO DE UN RUT REAL
                return (Number(cliente.rut[0]) > 0);
            });
        }
        catch {
            return [];
        }
    }

    public static async getDatosClientePorRut(rutToFetch: string): Promise<IInputClienteDataEnviar> {
        const urlToFetch = `${DataRequester.baseServerURL}/clientes/${rutToFetch}`;
        try {
            const fetchedData: IInputClienteDataEnviar = await fetch(urlToFetch).then(data => data.json());            
            return fetchedData;
        }
        catch {
            return getEmptyClienteData();
        }
    }

    public static async getListaServicios(fechaObjetivo: string): Promise<IServicioData[]> {
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/${fechaObjetivo}`;
        try {
            const fetchedData: IServicioData[] | string = await fetch(urlToFetch).then(data => data.json());
            if (typeof fetchedData === 'string') return [];
            return fetchedData;
        }
        catch {
            return [];
        }
    }

    public static async getTrabajoPorID(idBuscar: number): Promise<IServicioData | null> {
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/especificos/${idBuscar}`;
        try {
            const fetchedData: IServicioData | null = await fetch(urlToFetch).then(data => data.json());
            return fetchedData;
        }
        catch {
            return null;
        }
    }

    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------





    
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //* CORE OF EACH REQUEST THAT MODIFY DATA ------------------------------------------    
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    private static async performRequest<payloadType>(payloadToSend: payloadType, urlToFetch: string, method: httpMethodOption, errorDefaultMessage: string) {
        // const JWToken = window.localStorage.getItem("JWToken");
        const requestConfig = { 
            //TODO: FIX THIS AFTER FINDING OUT WHY THE BACKEND ONLY WORKS WITH THIS 2
            method: (method === 'get') ? 'get' : 'post',
            body: JSON.stringify(payloadToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const fetchedData = await fetch(urlToFetch, requestConfig).then(data => data.json()).catch(err => err);
        return String(fetchedData);
        // return (typeof fetchedData === 'string') ? fetchedData : errorDefaultMessage;
    }


    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    //*---------------------------------------------------------------------------------
    
    
    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    //*  AGREGAR - MODIFICAR - BORRAR TRABAJOS -----------------------------------------
    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    public static async agregarServicioNuevo(servicioToSend: IServicioBodyRequestFormat) {
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/`;
        const httpMethod = 'post';
        const defaultErrorMsg = 'ERROR EN LA PETICI??N DE CREAR REGISTRO DE TRABAJO';
        return DataRequester.performRequest(servicioToSend, urlToFetch, httpMethod, defaultErrorMsg);
    }


    public static async modificarServicioGuardado(servicioToSend: IServicioBodyRequestFormat) {
        //* SI ES MENOR A 1, ENTONCES NO ES UN TRABAJO GUARDADO EN LA BASE DE DATOS
        if (servicioToSend.id < 1) return 'ERROR EN LA PETICI??N DE ELIMINAR SERVICIO';

        const urlToFetch = `${DataRequester.baseServerURL}/servicios/modificar`;
        const httpMethod = 'patch';
        const defaultErrorMsg = 'ERROR EN LA PETICI??N DE MODIFICAR TRABAJO';
        return DataRequester.performRequest(servicioToSend, urlToFetch, httpMethod, defaultErrorMsg);
    }

    public static async borrarServicioGuardado(idTrabajoBorrar: number) {
        //* SI ES MENOR A 1, ENTONCES NO ES UN TRABAJO GUARDADO EN LA BASE DE DATOS
        if (idTrabajoBorrar < 1) return 'ERROR EN LA PETICI??N DE ELIMINAR SERVICIO';

        const payloadToSend = {id: idTrabajoBorrar};
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/borrar`;
        const httpMethod = 'delete';
        const defaultErrorMsg = 'ERROR EN LA PETICI??N DE ELIMINAR REGISTRO DE TRABAJO';
        return DataRequester.performRequest(payloadToSend, urlToFetch, httpMethod, defaultErrorMsg);
    }


    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------
    //* --------------------------------------------------------------------------------


    public static async enviarDatosCotizacion(ensambledObjToSend: ICotizacionEnviar) {
        const urlToFetch = `${DataRequester.baseServerURL}/cotizaciones/`;
        const httpMethod = 'post';
        const defaultErrorMsg = 'ERROR AL GUARDAR DATOS COTIZACION';
        return DataRequester.performRequest(ensambledObjToSend, urlToFetch, httpMethod, defaultErrorMsg);
    }
}