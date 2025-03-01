function openModal(popupElement) {
    popupElement.classList.add('popup_is-opened');

    const closeButton = popupElement.querySelector('.popup__close');

    closeButton.addEventListener('click', handleClose);
    popupElement.addEventListener('click', handleOverlayClose);
    document.addEventListener('keydown', handleEscClose);
}

function closeModal(popupElement) {
    popupElement.classList.remove('popup_is-opened');

    const closeButton = popupElement.querySelector('.popup__close');

    closeButton.removeEventListener('click', handleClose);
    popupElement.removeEventListener('click', handleOverlayClose);
    document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
    if (evt.key === "Escape") {
        const modalWindow = document.querySelector('.popup_is-opened');
        closeModal(modalWindow)
    }
}

function handleClose(evt) {
    const popupElement = evt.target.closest('.popup');
    closeModal(popupElement);
}

function handleOverlayClose(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

function renderLoading(submitButton, isLoading) {
    if (isLoading) {
        submitButton.textContent = 'Сохранение';
        submitButton.classList.add('loading');
    } else {
        submitButton.classList.remove('loading');
        submitButton.textContent = 'Сохранить';
    }
}

export {openModal, closeModal, renderLoading}