export const pathSrcImagen = '/img/invent369Logo.png';

export const saveCotizacionesSwitcherID_container = 'saveCotizacionesSwitcherID_container';

export const maxPageIndex = 4;

export const maximumLenghts = {
    maxTelefonoLength: 9,
    maxRutLength: 10,
    maxCantidadLength:9
}


const keyToUse_ultimoRutGuardado = 'ultimoRut';

export const ultimoRutManagerObj = {
    saveRutInLocalStorage: (rutToSave: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(keyToUse_ultimoRutGuardado, rutToSave);
    },

    getUltimoRut_localStorage: () => {
        if (typeof window === 'undefined') return '';

        const ultimoRut = window.localStorage.getItem(keyToUse_ultimoRutGuardado);
        //* si ulitmoRut NO es null, lo retornará. de otro modo, retornará ''
        return ultimoRut ?? '';
    }
}