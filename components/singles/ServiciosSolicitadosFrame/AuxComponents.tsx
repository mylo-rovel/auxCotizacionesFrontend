import { FC } from "react"

interface IBotonesFinales_MasMenos_Props {
    rowCharacteristics: {
        rowIsLastOne: boolean;
        shouldDisplayMinusButton: boolean;
    }
    addNewRow: () => void;
    removeRow: () => void;
    styles: { readonly [key: string]: string; };
}

export const BotonesFinales_Mas_Menos:FC<IBotonesFinales_MasMenos_Props> = (props) => {
    const {rowCharacteristics, addNewRow, removeRow, styles} = props;

    if (!rowCharacteristics.rowIsLastOne) return <></>;
    return (
        <>
            <td className={styles['servicio-solicitado-row-button']} >
                <button className={styles['add-row-button']} onClick={addNewRow}>
                    <h4>+</h4>
                </button>
            </td>

            <td className={styles['servicio-solicitado-row-button']}>            
                {(rowCharacteristics.shouldDisplayMinusButton)
                    ? <button className={styles['remove-row-button']} onClick={removeRow}>
                        <h4>-</h4>
                      </button>
                    : <button className={styles['hidden-button']}>
                         <h4> </h4>
                      </button>
                }
            </td>
        </>)
}

//* -----------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------
//* -----------------------------------------------------------------------------------------------