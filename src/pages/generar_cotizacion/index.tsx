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
  //* NECESARIO PARA CAMBIAR DE SUBPAGINA
  const [subPageIndex, setSubPageIndex] = useState<number>(0);

  //* ACÁ INCLUIMOS DATOS COMO LA FECHA Y OTRAS COSAS QUE QUEREMOS ENVIAR
  const [cotiValoresExtra, setCotiValoresExtra] = useState<IValoresExtraCotizacion>(getEmptyCotiValoresExtra());
  //* ACÁ INCLUIMOS TODOS LOS DATOS DEL CLIENTE
  const [clienteData, setClienteData] = useState<IInputClienteDataEnviar>(getEmptyClienteData());
  //* ACÁ INCLUIMOS TODOS LOS SERVICIOS SOLICITADOS QUE QUEREMOS ENVIAR
  const [serviciosSolicitadosArr, setServSolicitadosArr] = useState<IServicioSolicitado[]>([getEmptyServicioSolicitado()]);

  const resetCotizacionValues = () => {
    setCotiValoresExtra(getEmptyCotiValoresExtra());
    setClienteData(getEmptyClienteData());
    setServSolicitadosArr([getEmptyServicioSolicitado()]);
  }

  const PageContentToRender = getPageContent(
    [
      subPageIndex, setSubPageIndex, 

      setCotiValoresExtra, setClienteData, setServSolicitadosArr,

      cotiValoresExtra, clienteData, serviciosSolicitadosArr,

      getEnsambledCotizacionEnviar(cotiValoresExtra, clienteData, serviciosSolicitadosArr),
      
      resetCotizacionValues
    ]
  )
  
  const SwitchPageButtons = () => {
    //* MOSTRAR LOS BOTONES DE ABAJO SÓLO SI NO ESTAMOS EN EL CALENDARIO
    if (subPageIndex === 0) return <></>;
    
    const changePageButtonFunction = (indexVariation: number) => () => setSubPageIndex((prevState) => handleIndexChange(prevState,indexVariation, maxPageIndex))
    const GoBackButton = () => <button onClick={changePageButtonFunction(-1)}>{`<=`}</button>;
    const GoForwardButton = () => ((subPageIndex === maxPageIndex) || (subPageIndex < 2)) ? <></> : <button onClick={changePageButtonFunction(+1)}>{`=>`}</button>
    return (<>
        <div id={saveCotizacionesSwitcherID_container} className={styles['bottom-pageSwitchers-container']}>
          <GoBackButton/>
          <GoForwardButton/>
        </div>
    </>);
  }
  
  return (
    <>
      {JSON.stringify(clienteData)}
      {PageContentToRender}
      <SwitchPageButtons/>
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