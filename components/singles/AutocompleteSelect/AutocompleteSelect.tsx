import { FC } from 'react';

import { IAutocompleteSelectProps } from 'models';
import styles from './AutocompleteSelect.module.css';

export const AutocompleteSelect:FC<IAutocompleteSelectProps> = ({dataListID, optionsList, placeholderText, cssClasses}) => {
    const cssClassesToUse = `${styles['autocomplete-input']}
    ${cssClasses}`
    
    const optionsListElements = optionsList.map((optionValue, index) => {
        return <option 
            key={`option_autocomplete_${index}`} 
            value={optionValue} 
            className={styles['option-datalist-item']}
        />
    })

    return (
    <>  
        <label></label>
        <input type='search' list={dataListID} placeholder={placeholderText} className={cssClassesToUse}/>
        <datalist id={dataListID} className={styles['datalist-container']} >
            {optionsListElements}
        </datalist>
    </>
    )
}