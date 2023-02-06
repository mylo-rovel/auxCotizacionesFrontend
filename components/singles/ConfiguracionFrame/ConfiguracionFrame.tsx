import Image from "next/image";
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from "react";

import { FancyButton } from "../index";
import { DataRequester } from "apiClient"
import styles from "./ConfiguracionFrame.module.css";
import { IConfiguracionFrameProps, IProviderData } from "models";
import { onClickGoToPage, pathSrcImagen, splitAndJoinStr } from "utils";

export const ConfiguracionFrame:FC<IConfiguracionFrameProps> = () => {
    const [dataRows, setDataRows] = useState<JSX.Element[]>([]);
    const nextRouter = useRouter()

    useEffect(() => {
        const innerGetProviderData = async () => {
            const providerData: IProviderData = await DataRequester.getProviderData();
            const propsArr = Object.entries(providerData);
            const rowsJSX = propsArr.map((propEntry, index) => {     
                return  <div key={`config_row_${index}`} className={styles['row-container']}>
                            <div className={styles['obj-property-section']}> <h2>{propEntry[0]}</h2> </div>
                            <div className={styles['obj-value-section']}>    <h2>{propEntry[1]}</h2> </div>
                        </div>
            })
            setDataRows(rowsJSX);
            return;            
        }
        innerGetProviderData()
    },[]);

    const modifConfigPage = "modificar config";
    const goToPage = () => onClickGoToPage(nextRouter, splitAndJoinStr(modifConfigPage," ","_"));

    return (
    <>
        <div className={styles['modificar-config-button-container']}>
            <FancyButton textToDisplay="Modificar" onClickFn={goToPage}/>
        </div>

        <div className={styles['providerData-container']}>
            <div className={styles['text-values-section']}>
                {dataRows}
            </div>

            <div className={styles['image-section']}>
                <Image 
                    src={pathSrcImagen}
                    alt={"logo_empresa"}
                    fill
                />
            </div>

        </div>
    </>
    )
}
