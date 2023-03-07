import { FC, PropsWithChildren } from 'react';

import { IPortaledModalProps } from 'models';
import styles from './PortaledModal.module.css';
import { FancyButton, PortalContainer } from 'components/singles';

export const PortaledModal: FC<PropsWithChildren<IPortaledModalProps>> = (props) => {
    const {children, buttonText, buttonFn, contentIsNotOnlyText} = props;

    const contentContainerClass = (contentIsNotOnlyText) ? '' : styles['portal-modal-text-section'];

    return (
    <>
        <PortalContainer>
            <article className={styles['portal-modal-container']}>
                <section className={`${contentContainerClass}`}>
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
  