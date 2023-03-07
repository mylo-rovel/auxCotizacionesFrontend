import { GetStaticProps } from 'next';

import { NextPageWithLayout } from "../_app";
import { IServiciosPageProps } from "models";
import { MainLayout } from 'components/layouts';
import { ServiciosFrame } from 'components/singles';
import { ContextProvidersWrapper } from "context/ContextWrapper";


const ServiciosPage: NextPageWithLayout<IServiciosPageProps> = (props) => {
  return (
    <>
      <ServiciosFrame/>
    </>
  )
};

ServiciosPage.getLayout = function getLayout(page:JSX.Element){
  return(
    <ContextProvidersWrapper>
      <MainLayout title="Auxiliar Registro Trabajos">
        {page}
      </MainLayout>
    </ContextProvidersWrapper>
  )
}


export default ServiciosPage;


export const getStaticProps: GetStaticProps = async (ctx) => {
  // The purpose of creating this object is to return an object that has the same
  // type of the props we put in the page component right above
  // This way we make sure that those objects match
  const returnObj: IServiciosPageProps = {
    // Here goes the properties of the interface
  }

  // Here goes the fetch part

  return {
    props: returnObj
  }
}