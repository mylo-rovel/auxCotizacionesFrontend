import { NextPageWithLayout } from "../_app";
import { IConfiguracionPageProps } from "../../../models";
import { MainLayout } from '../../../components/layouts';
// import { ConfiguracionFrame } from 'components/singles';

const BuscarPage: NextPageWithLayout<IConfiguracionPageProps> = (props) => {
  return <></>
};

BuscarPage.getLayout = function getLayout(page:JSX.Element){
  return(
    <MainLayout title="AuxiliarCotizaciones">
      {page}
    </MainLayout>
  )
}


export default BuscarPage;