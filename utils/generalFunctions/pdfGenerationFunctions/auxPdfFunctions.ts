import {jsPDF, TableConfig, CellConfig} from 'jspdf';

import { pathSrcImagen } from 'utils/generalData/generalData';
import { IInputClienteDataEnviar, IProviderData, IServicioIDDataAccessObj, IServicioSolicitado } from 'models';


export type point = {x: number, y: number};

export const addCotizacionHeader = (doc: jsPDF, fechaCotizacion: string, fechaValidezCoti: string) => {
    const fechaCotizacionFixed = fechaCotizacion.split('-').join('/');
    const fechaLimiteValidezFixed = fechaValidezCoti.split('-').join('/');
    
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text(`COTIZACIÓN N.°: ${158}`, 120, 20);
    doc.setFont("times", "normal");

    doc.setFontSize(16);
    doc.text(`Fecha`, 125, 26);
    doc.text(`Válido hasta`, 125, 32);
    doc.text(`/${fechaCotizacionFixed}`, 155, 26);
    doc.text(`/${fechaLimiteValidezFixed}`, 155, 32);
    doc.line(125, 34, 180, 34); // horizontal line


}


//* ---------------------------------------------------------------------------------------
//* ---------------------------------------------------------------------------------------
//* ---------------------------------------------------------------------------------------



export const addSquaredCompanyImg = (doc: jsPDF, topLeftPoint: point, imgWidth: number, imgHeight: number, extraPadding: number) => {
    // //* ADDING A SQUARE TO THE IMAGE AND A PADDING
    doc.addImage(pathSrcImagen, "JPEG", topLeftPoint.x, topLeftPoint.y, imgWidth, imgHeight);
    
    // const topLeftPoint: point = {x: 25, y: 20};
    const topRightPoint: point = {x: topLeftPoint.x + imgWidth, y: topLeftPoint.y};
    const bottomRightPoint: point = {x: topLeftPoint.x + imgWidth, y: topLeftPoint.y + imgHeight};
    const bottomLeftPoint: point = {x: topLeftPoint.x, y: topLeftPoint.y + imgHeight};

    doc.line(topLeftPoint.x - extraPadding, topLeftPoint.y - extraPadding, topRightPoint.x + extraPadding, topRightPoint.y - extraPadding); // top-line
    doc.line(topRightPoint.x + extraPadding, topRightPoint.y -extraPadding, bottomRightPoint.x + extraPadding, bottomRightPoint.y + extraPadding); // right-line
    doc.line(bottomLeftPoint.x - extraPadding, bottomLeftPoint.y + extraPadding, bottomRightPoint.x + extraPadding, bottomRightPoint.y + extraPadding); // bottom-line
    doc.line(topLeftPoint.x - extraPadding, topLeftPoint.y - extraPadding, bottomLeftPoint.x - extraPadding, bottomLeftPoint.y + extraPadding); // left-line
    

    // const imgSize: [width: number, height: number] = [40, 40];
    // doc.addImage(pathSrcImagen, "JPEG", 25, 20, imgSize[0], imgSize[1]);

    // //* ADDING A SQUARE TO THE IMAGE AND A PADDING
    // const topLeftPoint: point = {x: 25, y: 20};
    // const topRightPoint: point = {x: 65, y: 20};
    // const bottomRightPoint: point = {x: 65, y: 60};
    // const bottomLeftPoint: point = {x: 25, y: 60};
    // const extraPadding = 5;
    // doc.line(25-extraPadding, 20-extraPadding, 65+extraPadding, 20-extraPadding); // top-line
    // doc.line(65+extraPadding, 20-extraPadding, 65+extraPadding, 60+extraPadding); // right-line
    // doc.line(25-extraPadding, 60+extraPadding, 65+extraPadding, 60+extraPadding); // bottom-line
    // doc.line(25-extraPadding, 20-extraPadding, 25-extraPadding, 60+extraPadding); // left-line
}



//* ---------------------------------------------------------------------------------------
//* ---------------------------------------------------------------------------------------
//* ---------------------------------------------------------------------------------------




const addColumnOfDobleDots = (doc: jsPDF, xPosition: number, yHighestPosition: number, repetitions: number) => {
    for (let i = 1; i < 1+repetitions; i++) doc.text(`:`, xPosition, yHighestPosition + 6*i);
}

// export const addProveedorText = (doc: jsPDF, datosProveedor: IProviderData, formaPago: string) => {
export const addProveedorText = (doc: jsPDF, formaPago: string) => {
    const datosProveedor: IProviderData = {
        Razon_social: "INVEN369 SPA",
        Rut: "76.499.126-5",
        Giro: "Mantenimiento, Reparacion Maquinarias",
        Direccion: "Pan de Azúcar 970",
        Telefono: 997952433,
        Email: "orojash@proton.me",
        Ciudad: "Coquimbo",
    }

    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(`Razon Social`, 70, 45);
    doc.text(`Rut`,          70, 51);
    doc.text(`Giro`,         70, 57);
    doc.text(`Direccion`,    70, 63);
    doc.text(`Telefono`,     70, 69);
    doc.text(`Email`,        70, 75);
    doc.text(`Ciudad`,       70, 81);
    doc.text(`Forma pago`,   70, 87);
    
    addColumnOfDobleDots(doc, 95, 45-6, 8);

    doc.text(`${datosProveedor.Razon_social}`, 102, 45);
    doc.text(`${datosProveedor.Rut}`,          102, 51);
    doc.text(`${datosProveedor.Giro}`,         102, 57);
    doc.text(`${datosProveedor.Direccion}`,    102, 63);
    doc.text(`${datosProveedor.Telefono}`,     102, 69);
    doc.text(`${datosProveedor.Email}`,        102, 75);
    doc.text(`${datosProveedor.Ciudad}`,       102, 81);
    doc.text(`${formaPago}`,                   102, 87);
}

export const addClienteText = (doc: jsPDF, clienteData: IInputClienteDataEnviar) => {
    let yTitleLevel = 95
    const yLineLevel = yTitleLevel + 6*1.35;
    const xStartValue = 15;
    const xWidth = 175;
    //* HORIZONTAL LINE - TOP
    doc.line(xStartValue, yTitleLevel, (xStartValue + xWidth), yTitleLevel);
    doc.text(`DESTINATARIO:`, xStartValue, yTitleLevel + 6*0.85);
    yTitleLevel = yTitleLevel + 6*1.25;
    doc.line(xStartValue, yTitleLevel, (xStartValue + xWidth), yTitleLevel);

    doc.setFont("times", "normal");
    doc.text(`Señor(es)`, xStartValue, yLineLevel + 6*1);
    doc.text(`Rut`,       xStartValue, yLineLevel + 6*2);
    doc.text(`E-mail`,    xStartValue, yLineLevel + 6*3);
    doc.text(`Telefono`,  xStartValue, yLineLevel + 6*4);
    doc.text(`Direccion`, xStartValue, yLineLevel + 6*5);
    doc.text(`Contacto`,  xStartValue, yLineLevel + 6*6);
    
    addColumnOfDobleDots(doc, xStartValue + 17, yLineLevel, 6);

    doc.text(`${clienteData.nombre}`,    xStartValue + 20, yLineLevel + 6*1);
    doc.text(`${clienteData.rut}`,       xStartValue + 20, yLineLevel + 6*2);
    doc.text(`${clienteData.email}`,     xStartValue + 20, yLineLevel + 6*3);
    doc.text(`${clienteData.telefono}`,  xStartValue + 20, yLineLevel + 6*4);
    doc.text(`${clienteData.direccion}`, xStartValue + 20, yLineLevel + 6*5);
    doc.text(`${clienteData.contacto}`,  xStartValue + 20, yLineLevel + 6*6);

    //* HORIZONTAL LINE - BOTTOM
    yTitleLevel = yLineLevel + 6*6 + 6*0.65;
    doc.line(xStartValue, yTitleLevel, (xStartValue + xWidth), yTitleLevel);
}




//* ---------------------------------------------------------------------------------------
//* ---------------------------------------------------------------------------------------
//* ---------------------------------------------------------------------------------------




interface ITablaTrabajosSectionPDF {
    doc: jsPDF;
    serviciosSolicitadosArr: IServicioSolicitado[];
    dict_IdTrabajo_DatosTrabajo: IServicioIDDataAccessObj;
    fechaTrabajoEscogida: string;
}

export const addTablaTrabajosSectionPDF = (props: ITablaTrabajosSectionPDF) => {
    const {doc, serviciosSolicitadosArr, dict_IdTrabajo_DatosTrabajo, fechaTrabajoEscogida} = props;
    const fechaTrabajoFixed = fechaTrabajoEscogida.split('-').join('/');


    let yTitleLevel = 145
    const xStartValue = 15;
    const xWidth = 175;
    doc.text(`SERVICIOS SOLICITADOS (DÍA ${fechaTrabajoFixed}):`, xStartValue, yTitleLevel + 6*0.525);
    yTitleLevel = yTitleLevel + 6*1.0;
    doc.line(xStartValue, yTitleLevel, (xStartValue + xWidth), yTitleLevel);

    const xTopLeftTablePos = xStartValue;
    const yTopLeftTablePos = yTitleLevel + 6;

    if (serviciosSolicitadosArr.length < 1) return;

    type headerTitleOption = 'Codigo' | 'Detalle' | 'Equipo' | 'Valor';
    type rowData = { [key in headerTitleOption]: string; }
    
    const tableRowsArr: rowData[] = serviciosSolicitadosArr.map((currTrabajo) => {
        const trabajoData = dict_IdTrabajo_DatosTrabajo[currTrabajo.id];
        const {codigo, detalle_servicio, equipo, valor} = trabajoData;
        return {
            Codigo: codigo,
            Detalle: detalle_servicio,
            Equipo: equipo,
            Valor: String(valor),
        }
    })

    //* THIS WORK BECAUSE THE ARRAY HAS ALWAYS AT LEAST THE INDEX = 0 ELEMENT AN IT'S TYPED
    const headersKeys = Object.keys(tableRowsArr[0]);
    const headersTableData: CellConfig[] = headersKeys.map((header) => {
        const columnWidth = 50;
        return {
            // id: header,
            name: header,
            prompt: header,
            width: columnWidth,
            align: 'center',
            padding: 0,
        }
    }) 
    
          
    const tableConfig: TableConfig = {
        // autoSize: true,
    };
    
    doc.table(xTopLeftTablePos, yTopLeftTablePos, tableRowsArr, headersTableData, tableConfig);
}