function openModal(popupElement) {
    popupElement.classList.add('popup_is-opened');
    const closeButton = popupElement.querySelector('.popup__close');

    closeButton.addEventListener('click', handleClose)
    popupElement.addEventListener('click', handleOverlayClose)
    document.addEventListener('keydown', handleEscClose);
}

function closeModal(popupElement) {
    popupElement.classList.remove('popup_is-opened');
    
    popupElement.removeEventListener('click', handleClose);
    document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
    if (evt.key === "Escape") {
        const modalWindow = document.querySelector('.popup_is-opened');
        closeModal(modalWindow)
    }
}

function handleClose(evt) {
    const popupElement = evt.target.closest('.popup_is-opened');
    closeModal(popupElement);
}

export function handleOverlayClose(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

export {openModal, closeModal}