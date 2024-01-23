import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, open, onClose,  className = '' }) {
    // This dialog uses a reference in order create mutable dialog object that persist the lifetime of the component
    const dialog = useRef();

    // The dependencies array contains the open condition, such that the page will re-render only of the value of 'open' changes
    useEffect(() => {
        const modal = dialog.current; // because dialog is a ref, so it has a current property

        // If 'open' is true, show the modal dialog
        if (open) {
            modal.showModal();
        }

        // Cleanup function: close the modal dialog when the component unmounts or 'open' changes to false
        return () => modal.close();
    }, [open]);

    // Use createPortal to render the modal outside the root DOM element
    return createPortal(
        <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>
            {children}
        </dialog>,
        // The modal element is not part of the root DOM element, it is appended to the element with the ID 'modal'
        // The children property is in order to show the content inside the modal
        document.getElementById('modal')
    );
}