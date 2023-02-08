import { 
    IServicioData, IProviderData, IRawProviderData,
    IServicioBodyRequestFormat, IModificarServicioDataEnviar
} from "models";


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
            console.log("DataRequester getProviderData error")
        }
        finally {
            return objToReturn
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

    public static async agregarServicioNuevo(servicioToSend: IServicioBodyRequestFormat) {
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
            return fetchedData;
        }
        return 'ERROR EN LA PETICIÓN DE AGREGAR SERVICIO';
    }


    public static async modificarServicioGuardado(serviciosToSend: IModificarServicioDataEnviar) {
        // const JWToken = window.localStorage.getItem("JWToken");
        const postConfig = { 
            method: 'patch',
            body: JSON.stringify(serviciosToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/crear`;
        const fetchedData: unknown = await fetch(urlToFetch, postConfig).then(data => data.json()).catch(err => err);
        if (typeof fetchedData === 'string') {
            return fetchedData;
        }
        return 'ERROR EN LA PETICIÓN DE MODIFICAR SERVICIO';
    }

    public static async borrarServicioGuardado(servicioToSend: IServicioBodyRequestFormat) {
        // const JWToken = window.localStorage.getItem("JWToken");
        const postConfig = { 
            method: 'delete',
            body: JSON.stringify(servicioToSend),
            headers: { 
                'Content-Type': 'application/json',
                // 'authorization': JWToken
            }
        };
        const urlToFetch = `${DataRequester.baseServerURL}/servicios/crear`;
        const fetchedData: string = await fetch(urlToFetch, postConfig).then(data => data.json()).catch(err => err);
        if (typeof fetchedData === 'string') {
            return fetchedData;
        }
        return 'ERROR EN LA PETICIÓN DE ELIMINAR SERVICIO';
    }
}