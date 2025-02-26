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
    const popupElement = evt.target.closest('.popup');
    closeModal(popupElement);
}

function handleOverlayClose(evt) {
    if (evt.target === evt.currentTarget) {
        closeModal(evt.currentTarget);
    }
}

function handleOpenImage(imageLink, imageName) {
    const imageElement = document.querySelector('.popup__image');
    const popupImage = document.querySelector('.popup_type_image');
    const captionElement = document.querySelector('.popup__caption');

    imageElement.src = imageLink;
    imageElement.alt = imageName;

    captionElement.textContent = imageName;

    openModal(popupImage);
}

function handleOpenConfirmation(onConfirm) {
    const popupWithConfirmation = document.querySelector('.popup_confirmation');
    openModal(popupWithConfirmation);
  
    const confirmButton = popupWithConfirmation.querySelector('.button__confirmation');
    confirmButton.addEventListener('click', function() {
      onConfirm();
      closeModal(popupWithConfirmation);
    });
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

export {openModal, closeModal, handleOpenImage, handleOpenConfirmation, renderLoading}