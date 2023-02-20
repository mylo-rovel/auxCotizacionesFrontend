import { useState, useRef } from 'react';

import { NextPageWithLayout } from "../_app";
import { MainLayout } from 'components/layouts';
import styles from "./registrar_servicios.module.css";
import { getPageContent, handleIndexChange} from './pageAuxFunctions';
import { IRegistrarServiciosPageProps, IValoresExtraCotizacion, IInputClienteDataEnviar, IServicioSolicitado } from "../../../models";
import { getEmptyCotiValoresExtra, getEmptyClienteData, getEnsambledCotizacionEnviar, saveCotizacionesSwitcherID_container } from 'utils';

const RegistrarServiciosPage: NextPageWithLayout<IRegistrarServiciosPageProps> = (props) => {
  const [subPageIndex, setSubPageIndex] = useState<number>(0);
  //* ACÁ INCLUIMOS DATOS COMO LA FECHA Y OTRAS COSAS QUE QUEREMOS ENVIAR
  const [cotiValoresExtra, setCotiValoresExtra] = useState<IValoresExtraCotizacion>(getEmptyCotiValoresExtra());
  //* ACÁ INCLUIMOS TODOS LOS DATOS DEL CLIENTE
  //TODO: OJO, REVISAR SI EN LA PAGINA DE CLIENTE TENEMOS QUE USAR setCotiValoresExtra
  const [clienteData, setClienteData] = useState<IInputClienteDataEnviar>(getEmptyClienteData());
  //* ACÁ INCLUIMOS TODOS LOS SERVICIOS SOLICITADOS QUE QUEREMOS ENVIAR
  const [serviciosSolicitadosArr, setServSolicitadosArr] = useState<IServicioSolicitado[]>([]);

  const PageContentToRender = getPageContent(
    [
      subPageIndex, setSubPageIndex, 
      
      setCotiValoresExtra, setClienteData, setServSolicitadosArr,

      cotiValoresExtra, clienteData, serviciosSolicitadosArr
    ]
  )
  
  const changePageButtonFunction = (indexVariation: number) => () => {
    setSubPageIndex((prevState) => handleIndexChange(prevState,indexVariation,4))
  }

  const switchButtons = (subPageIndex === 0) 
      ? <></>
      : <div id={saveCotizacionesSwitcherID_container} className={styles['bottom-pageSwitchers-container']}>
          <button onClick={changePageButtonFunction(-1)}>{`<=`}</button>
          <button onClick={changePageButtonFunction(+1)}>{`=>`}</button>
        </div>

  return (
    <>
      {JSON.stringify(serviciosSolicitadosArr)}
      {PageContentToRender}
      {/* MOSTRAR LOS BOTONES DE ABAJO SÓLO SI NO ESTAMOS EN EL CALENDARIO*/}
      {switchButtons}
    </>
  )
};

RegistrarServiciosPage.getLayout = function getLayout(page:JSX.Element){
  return(
    <MainLayout title="AuxiliarCotizaciones">
      {page}
    </MainLayout>
  )
}

export default RegistrarServiciosPage;