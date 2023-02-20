import { FC, PropsWithChildren, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom'

interface IPortalContainerProps {        
        selector?: string;
        classNamesArr?: string[];
        containerElement?: string
}

export const PortalContainer: FC<PropsWithChildren<IPortalContainerProps>> = ({ children, classNamesArr = ['portal-root-element'], containerElement = 'div', selector = '#portal-root-div' }) => {
    const containerRef = useRef<Element | null>(null);
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
        // //? THIS WAY IS CONVENIENT WHEN MANUALLY ADDING THE div ELEMENT (GO TO src/pages/_document.tsx)
        // containerRef.current = document.querySelector(selector); 
        // if (containerRef.current) {
        //     containerRef.current.classList.add(...classNamesArr);
        //     document.body.appendChild(containerRef.current);
        // }
        containerRef.current = document.createElement(containerElement);
        containerRef.current.classList.add(...classNamesArr);
        document.body.appendChild(containerRef.current);
        setMounted(true);
        return () => {
            if (containerRef.current) document.body.removeChild(containerRef.current);
        }        
    }, [])
  
    return (mounted && containerRef.current) ? createPortal(children, containerRef.current) : null
  }
  