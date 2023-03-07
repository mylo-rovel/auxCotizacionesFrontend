import { GetStaticProps } from 'next';

import { IHomePageProps } from "models";
import { NextPageWithLayout } from "./_app";
import { MainLayout } from 'components/layouts';
import { MainPageFrame } from 'components/singles';


const HomePage: NextPageWithLayout<IHomePageProps> = (props) => {
  return (
    <>
      <MainPageFrame/>
    </>
  )
};

HomePage.getLayout = function getLayout(page:JSX.Element){
  return(
    <MainLayout title="AuxiliarCotizaciones">
      {page}
    </MainLayout>
  )
}


export default HomePage;


export const getStaticProps: GetStaticProps = async (ctx) => {
  // The purpose of creating this object is to return an object that has the same
  // type of the props we put in the page component right above
  // This way we make sure that those objects match
  const returnObj: IHomePageProps = {
    // Here goes the properties of the interface
  }

  // Here goes the fetch part

  return {
    props: returnObj
  }
}