import {jsPDF, jsPDFOptions} from 'jspdf';
import { IInputClienteDataEnviar, IProviderData, IServicioIDDataAccessObj, IServicioSolicitado } from 'models';

import { addClienteText, addCotizacionHeader, addProveedorText, addSquaredCompanyImg, addTablaTrabajosSectionPDF, point } from './auxPdfFunctions';

interface IGenerateNewCotizacionPDF {
    formaPago: string;
    fechaTrabajoEscogida: string;
    fechaCotizacion: string;
    fechaValidezCoti : string;
    // datosProveedor: IProviderData;
    clienteData: IInputClienteDataEnviar;
    serviciosSolicitadosArr: IServicioSolicitado[];
    dict_IdTrabajo_DatosTrabajo: IServicioIDDataAccessObj;
}

export const generateNewCotizacionPDF = (props: IGenerateNewCotizacionPDF) => {
    const {
        formaPago,
        fechaTrabajoEscogida,
        fechaCotizacion,
        fechaValidezCoti,
        // datosProveedor,
        clienteData,
        serviciosSolicitadosArr,
        dict_IdTrabajo_DatosTrabajo,        
    } = props;
    
    const docConfig: jsPDFOptions = {};
    const doc = new jsPDF(docConfig);
    
    addCotizacionHeader(doc, fechaCotizacion, fechaValidezCoti);

    const topLeftPoint: point = {x: 20, y: 15};
    const [imgWidth, imgHeight] = [40, 40];
    addSquaredCompanyImg(doc, topLeftPoint, imgWidth, imgHeight, 5);

    // addProveedorText(doc, datosProveedor, formaPago);
    addProveedorText(doc, formaPago);

    addClienteText(doc, clienteData);

    addTablaTrabajosSectionPDF({ doc, serviciosSolicitadosArr, dict_IdTrabajo_DatosTrabajo, fechaTrabajoEscogida });

    doc.save('testFile');
}

