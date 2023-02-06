import { GetStaticProps } from 'next';

import { NextPageWithLayout } from "../_app";
import { IConfiguracionPageProps } from "../../../models";
import { MainLayout } from '../../../components/layouts';
import { ConfiguracionFrame } from 'components/singles';

const ConfiguracionPage: NextPageWithLayout<IConfiguracionPageProps> = (props) => {
  return <ConfiguracionFrame/>
};

ConfiguracionPage.getLayout = function getLayout(page:JSX.Element){
  return(
    <MainLayout title="AuxiliarCotizaciones">
      {page}
    </MainLayout>
  )
}


export default ConfiguracionPage;


export const getStaticProps: GetStaticProps = async (ctx) => {
  // The purpose of creating this object is to return an object that has the same
  // type of the props we put in the page component right above
  // This way we make sure that those objects match
  const returnObj: IConfiguracionPageProps = {
    // Here goes the properties of the interface
  }

  // Here goes the fetch part

  return {
    props: returnObj
  }
}