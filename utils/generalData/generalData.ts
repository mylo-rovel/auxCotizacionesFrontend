//* IMPORTANT: THIS IS USED IN THE configuracion PAGE
export const pathSrcImagen = '/img/invent369Logo.png';

export const saveCotizacionesSwitcherID_container = 'saveCotizacionesSwitcherID_container';

//* IMPORTANT: THIS IS USED IN THE CONTEXT STATE API trabajosContext.ts AND TrabajosProvider.tsx
//* THIS WAY WE CAN RESET THE VALUE TO A STANDARD VALUE
export const defaultNUEVA_COTIZACION_ID = -1;

//* IMPORTANT: THIS IS USED IN THE CONTEXT STATE API trabajosContext.ts AND TrabajosProvider.tsx
//* THIS WAY WE CAN RESET THE VALUE TO A STANDARD VALUE
export const defaultTrabajo_INITIAL_ID = -1;

//* IMPORTANT: THIS IS USED IN THE generar pdf PAGE (IN THE BUTTONS TO CHANGE SUBPAGE)
export const maxPageIndex = 4;

//* IMPORTANT: THIS IS USED IN THE CHECKING OF THE INFORMATION THE USER ENTERED
export const maximumLenghts = {
    maxTelefonoLength: 9,
    maxRutLength: 10,
    maxCantidadLength:9,
    maxValorLength:9
}

//* IMPORTANT: THIS IS USED IN THE SUBPAGE OF CLIENT (generar pdf PAGE)
const keyToUse_ultimoRutGuardado = 'ultimoRut';
export const ultimoRutManagerObj = {
    saveRutInLocalStorage: (rutToSave: string) => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(keyToUse_ultimoRutGuardado, rutToSave);
    },

    getUltimoRut_localStorage: () => {
        if (typeof window === 'undefined') return '';

        const ultimoRut = window.localStorage.getItem(keyToUse_ultimoRutGuardado);
        //* si ulitmoRut NO es null, lo retornarĂ¡. de otro modo, retornarĂ¡ ''
        return ultimoRut ?? '';
    }
}

export const monthsByNumber: {[key:number]: string} = {
    1: 'enero',
    2: 'febrero',
    3: 'marzo',
    4: 'abril',
    5: 'mayo',
    6: 'junio',
    7: 'julio',
    8: 'agosto',
    9: 'septiembre',
    10: 'octubre',
    11: 'noviembre',
    12: 'diciembre',
}