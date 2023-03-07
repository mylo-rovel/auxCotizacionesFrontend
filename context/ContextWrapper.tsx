import { FC, PropsWithChildren } from 'react';

import { TrabajosProvider } from './trabajos';

export const ContextProvidersWrapper:FC<PropsWithChildren> = ({children}) => {
    
    return (
        <>
        <TrabajosProvider>
            {children}
        </TrabajosProvider>
        </>
    )
};