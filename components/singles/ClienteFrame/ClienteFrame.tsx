import { FC } from "react";
import { useRouter } from "next/router";

import styles from "./ClienteFrame.module.css";
import { IClienteFrameProps } from "models";
import { navbarButtonNames, splitAndJoinStr, onClickGoToPage } from "utils";


export const ClienteFrame: FC<IClienteFrameProps> = () => {
    const nextRouter = useRouter();

    const navbarButtonsJSX = navbarButtonNames.map((nameStr, index) => {
        const goToPage = () => onClickGoToPage(nextRouter, splitAndJoinStr(nameStr," ","_").toLocaleLowerCase())
        return <button 
            key={`navbarButtonName_${index}`}
            onClick={() => onClickGoToPage(nextRouter, splitAndJoinStr(nameStr," ","_").toLocaleLowerCase())}
            >
                {nameStr}
            </button>
    })
    return (
        <div className={styles['navbar-container']}>
            {navbarButtonsJSX}
        </div>
    )
};