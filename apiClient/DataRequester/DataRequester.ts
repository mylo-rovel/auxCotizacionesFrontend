import { IServicioData, IProviderData, IRawProviderData } from "models";

export class DataRequester {
    private static baseServerURL = "http://localhost:4000/api/data";

    public static async getProviderData(): Promise<IProviderData> {
        const objToReturn: IProviderData = {
            Razon_social: "",
            Rut: "",
            Giro: "",
            Direccion: "",
            Telefono: 0,
            Email: "",
            Ciudad: "",
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
}