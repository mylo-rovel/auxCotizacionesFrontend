import { FC } from "react";
import { useRouter } from "next/router";

import { INavbarProps } from "models";
import styles from "./Navbar.module.css";
import { FancyButton } from "../index";
import { navbarButtonNames, splitAndJoinStr, onClickGoToPage } from "utils";


export const Navbar: FC<INavbarProps> = () => {
    const nextRouter = useRouter();

    const navbarButtonsJSX = navbarButtonNames.map((nameStr, index) => {
        const goToPage = () => onClickGoToPage(nextRouter, splitAndJoinStr(nameStr," ","_").toLocaleLowerCase())
        return <FancyButton 
                    textToDisplay = {nameStr}
                    key={`navbar_ButtonName_${index}`}
                    onClickFn={goToPage}
                />
    })
    return (
        <div className={styles['navbar-container']}>
            {navbarButtonsJSX}
        </div>
    )
};