export interface IClienteRutForAutocomplete {
    value: string;
}

export interface IClienteRut {
    rut: string;
    id: number;
}

export interface IClienteIDPorRut {
    //* RUT : ID_CLIENTE
    [key: string]: number;
}

export interface IInputClienteDataEnviar {
    id: number;
    nombre: string;
    rut: string;
    email: string;
    telefono: number;
    direccion: string;
    contacto: string;
    created_at: string;
    updated_at: string;
}