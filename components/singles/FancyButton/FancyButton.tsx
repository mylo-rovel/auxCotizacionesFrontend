import { FC } from "react";

import styles from "./FancyButton.module.css";
import { IFancyButtonProps } from "models";


export const FancyButton: FC<IFancyButtonProps> = ({ textToDisplay, onClickFn }) => {
    return <button onClick={onClickFn} className={styles['fancy-button']}>
                {textToDisplay}
           </button>
};