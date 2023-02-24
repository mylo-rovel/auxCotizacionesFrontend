import { 
    IServicioData, IProviderData, IRawProviderData,
    IServicioBodyRequestFormat, IModificarServicioDataEnviar, 
    IGeneralRequestResult, IClienteRut, IInputClienteDataEnviar, ICotizacionEnviar
} from "models";
import { getEmptyClienteData } from "utils";


export class DataRequester {
    private static baseServerURL = "http://localhost:4000/api/data";

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
            return fetchedData;
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

    public static async getListaServicios(): Promise<IServicioData[]> {
        const urlToFetch = `${DataRequester.baseServerURL}/servicios`;
        try {
            const fetchedData: IServicioData[] = await fetch(urlToFetch).then(data => data.json());
            return fetchedData;
        }
        catch {
            return [];
        }
    }

    public static async agregarServicioNuevo(servicioToSend: IServicioBodyRequestFormat): Promise<IGeneralRequestResult> {
        // const JWToken = window.localStorage.getItem("JWToken");
        const postConfig = { 
            method: 'post',
            body: JSON.stringify(servicioToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/crear`;
        const fetchedData: string = await fetch(urlToFetch, postConfig).then(data => data.json()).catch(err => err);
        if (typeof fetchedData === 'string') {
            // return fetchedData;
            return {
                operationResultStr: fetchedData,
                operationWasSuccess: true,
                payload: ''
            };
        }
        // return 'ERROR EN LA PETICIÓN DE AGREGAR SERVICIO';
        return {
            operationResultStr: 'ERROR EN LA PETICIÓN DE AGREGAR SERVICIO',
            operationWasSuccess: false,
            payload: ''
        };
    }


    public static async modificarServicioGuardado(serviciosToSend: IModificarServicioDataEnviar): Promise<IGeneralRequestResult> {
        // const JWToken = window.localStorage.getItem("JWToken");
        const postConfig = { 
            //? this should be: method: 'patch',  (backend problems)
            method: 'post',
            body: JSON.stringify(serviciosToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/modificar`;
        const fetchedData: unknown = await fetch(urlToFetch, postConfig).then(data => data.json()).catch(err => err);
        if (typeof fetchedData === 'string') {
            // return fetchedData;
            return {
                operationResultStr: fetchedData,
                operationWasSuccess: true,
                payload: ''
            };
        }
        // return 'ERROR EN LA PETICIÓN DE MODIFICAR SERVICIO';
        return {
            operationResultStr: 'ERROR EN LA PETICIÓN DE MODIFICAR SERVICIO',
            operationWasSuccess: false,
            payload: ''
        };
    }

    public static async borrarServicioGuardado(servicioToSend: IServicioBodyRequestFormat): Promise<IGeneralRequestResult> {
        // const JWToken = window.localStorage.getItem("JWToken");
        const postConfig = { 
            //? this should be: method: 'delete',  (backend problems)
            method: 'post',
            body: JSON.stringify(servicioToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/borrar`;
        const fetchedData: string = await fetch(urlToFetch, postConfig).then(data => data.json()).catch(err => err);
        if (typeof fetchedData === 'string') {
            // return fetchedData;
            return {
                operationResultStr: fetchedData,
                operationWasSuccess: true,
                payload: ''
            };
        }
        // return 'ERROR EN LA PETICIÓN DE ELIMINAR SERVICIO';
        return {
            operationResultStr: 'ERROR EN LA PETICIÓN DE ELIMINAR SERVICIO',
            operationWasSuccess: false,
            payload: ''
        };
    }

    public static async enviarDatosCotizacion(ensambledObjToSend: ICotizacionEnviar): Promise<IGeneralRequestResult> {
        const urlToFetch = `${DataRequester.baseServerURL}/cotizaciones/registrar`;
        const postConfig = { 
            method: 'post',
            body: JSON.stringify(ensambledObjToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const fetchedData: string = await fetch(urlToFetch, postConfig).then(data => data.json()).catch(err => err);
        if (typeof fetchedData === 'string') {
            // return fetchedData;
            return {
                operationResultStr: fetchedData,
                operationWasSuccess: true,
                payload: ''
            };
        }
        // return 'ERROR AL GUARDAR LA COTIZACIÓN';
        return {
            operationResultStr: 'ERROR AL GUARDAR LA COTIZACIÓN',
            operationWasSuccess: false,
            payload: ''
        };
    }
}