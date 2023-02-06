import { useState } from 'react';

import { NextPageWithLayout } from "../_app";
import { MainLayout } from 'components/layouts';
import styles from "./registrar_servicios.module.css";
import { IRegistrarServiciosPageProps } from "../../../models";
import { getPageContent, handleIndexChange} from './pageAuxFunctions';

const RegistrarServiciosPage: NextPageWithLayout<IRegistrarServiciosPageProps> = (props) => {
  const [subPageIndex, setSubPageIndex] = useState<number>(0);
  const [fechaCotización, setFechaCoti] = useState<Date>(new Date());

  const PageContentToRender = getPageContent(
    [subPageIndex, setFechaCoti, setSubPageIndex]
  )
  
  const switchButtons = (subPageIndex === 0) 
      ? <></>
      : <div className={styles['bottom-pageSwitchers-container']}>
          <button onClick={() => setSubPageIndex((prevState) => handleIndexChange(prevState,-1,4))}>{`<=`}</button>
          <button onClick={() => setSubPageIndex((prevState) => handleIndexChange(prevState,+1,4))}>{`=>`}</button>
        </div>

  return (
    <>
      {/* <h2>{fechaCotización.getDate()}</h2> */}
      {/* <h2>{subPageIndex}</h2> */}
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