// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
function createCard(data, handleDelete, handleLikeClick, handleOpenImage) {
    const cardElement = cardTemplate.cloneNode(true).querySelector('.card');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;

    deleteButton.addEventListener('click', () => {
        handleDelete(cardElement);
    });

    likeButton.addEventListener('click', handleLikeClick);

    cardImage.addEventListener('click', () => handleOpenImage(cardImage.src, cardTitle.textContent));

    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
}

// @todo: Функция Ставим лайк
function handleLikeClick(evt) {
    if (evt.target.classList.contains('card__like-button')) {
        evt.target.classList.toggle('card__like-button_is-active');
    }
}

export {createCard, deleteCard, handleLikeClick}