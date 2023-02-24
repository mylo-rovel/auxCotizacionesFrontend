import { FC, PropsWithChildren } from 'react';

import { IPortaledModalProps } from 'models';
import styles from './PortaledModal.module.css';
import { FancyButton, PortalContainer } from 'components/singles';

export const PortaledModal: FC<PropsWithChildren<IPortaledModalProps>> = ({children, buttonText, buttonFn}) => {
  
    return (
    <>
        <PortalContainer>
            <article className={styles['portal-modal-container']}>
                <section className={styles['portal-modal-text-section']}>
                    {children}
                </section>
                <section className={styles['portal-modal-button-section']}>
                    <FancyButton textToDisplay={buttonText} onClickFn={buttonFn}/>
                </section>
            </article>
        </PortalContainer>
    </>
    )
  }
  