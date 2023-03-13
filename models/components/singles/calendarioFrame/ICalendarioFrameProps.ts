export type calendarFrameToUse = 'fecha de cotización' | 'fecha de validez de la cotización' | ''; 

export interface ICalendarioFrameProps {
    dateSetter: (newDate: Date) => void;
    subpageTitle: calendarFrameToUse;
    changeToAnotherSubpage: () => void;
    resetCotizacionValues: () => void
}