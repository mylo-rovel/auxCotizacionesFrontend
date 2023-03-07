import { useState } from 'react';

import { maxPageIndex } from 'utils';
import { NextPageWithLayout } from "../_app";
import { MainLayout } from 'components/layouts';
import styles from "./registrar_servicios.module.css";
import { ContextProvidersWrapper } from "context/ContextWrapper";
import { getPageContent, handleIndexChange} from './pageAuxFunctions';
import { IRegistrarServiciosPageProps, IValoresExtraCotizacion, IInputClienteDataEnviar, IServicioSolicitado } from "../../../models";
import { getEmptyCotiValoresExtra, getEmptyClienteData, getEnsambledCotizacionEnviar, saveCotizacionesSwitcherID_container, getEmptyServicioSolicitado } from 'utils';

const GenerarCotizacionPage: NextPageWithLayout<IRegistrarServiciosPageProps> = (props) => {
  const [subPageIndex, setSubPageIndex] = useState<number>(0);
  //* ACÁ INCLUIMOS DATOS COMO LA FECHA Y OTRAS COSAS QUE QUEREMOS ENVIAR
  const [cotiValoresExtra, setCotiValoresExtra] = useState<IValoresExtraCotizacion>(getEmptyCotiValoresExtra());
  //* ACÁ INCLUIMOS TODOS LOS DATOS DEL CLIENTE
  //TODO: OJO, REVISAR SI EN LA PAGINA DE CLIENTE TENEMOS QUE USAR setCotiValoresExtra
  const [clienteData, setClienteData] = useState<IInputClienteDataEnviar>(getEmptyClienteData());
  //* ACÁ INCLUIMOS TODOS LOS SERVICIOS SOLICITADOS QUE QUEREMOS ENVIAR
  const [serviciosSolicitadosArr, setServSolicitadosArr] = useState<IServicioSolicitado[]>([getEmptyServicioSolicitado()]);

  const PageContentToRender = getPageContent(
    [
      subPageIndex, setSubPageIndex, 

      setCotiValoresExtra, setClienteData, setServSolicitadosArr,

      cotiValoresExtra, clienteData, serviciosSolicitadosArr,

      getEnsambledCotizacionEnviar(cotiValoresExtra, clienteData, serviciosSolicitadosArr)
    ]
  )
  
  const changePageButtonFunction = (indexVariation: number) => () => {
    setSubPageIndex((prevState) => handleIndexChange(prevState,indexVariation, maxPageIndex))
  }

  const switchButtons = (subPageIndex === 0)
      ? <></>
      : <div id={saveCotizacionesSwitcherID_container} className={styles['bottom-pageSwitchers-container']}>
           <button onClick={changePageButtonFunction(-1)}>{`<=`}</button>
          {((subPageIndex === maxPageIndex) || (subPageIndex < 2))
          ? <></>
          :<button onClick={changePageButtonFunction(+1)}>{`=>`}</button>
          }          
        </div>;
  
  const ensambledObjectToSend = getEnsambledCotizacionEnviar(cotiValoresExtra, clienteData, serviciosSolicitadosArr);
  
  return (
    <>
      {/* {JSON.stringify(getEnsambledCotizacionEnviar(cotiValoresExtra, clienteData, serviciosSolicitadosArr))} */}
      {PageContentToRender}
      {/* MOSTRAR LOS BOTONES DE ABAJO SÓLO SI NO ESTAMOS EN EL CALENDARIO*/}
      {switchButtons}
    </>
  )
};

GenerarCotizacionPage.getLayout = function getLayout(page:JSX.Element){
  return(
    <ContextProvidersWrapper>
      <MainLayout title="Auxiliar Registro Trabajos">
        {page}
      </MainLayout>
    </ContextProvidersWrapper>
  )
}

export default GenerarCotizacionPage;