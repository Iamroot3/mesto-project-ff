import { toggleLike } from './Api';
const cardTemplate = document.querySelector('#card-template').content;

function createCard(data, handleOpenImage, userId) {
    const cardElement = cardTemplate.cloneNode(true).querySelector('.card');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;
    cardElement.dataset.cardId = data._id;
    likeButton.dataset.like = data.likes.length;

    showTrash(deleteButton, data.owner._id, userId);

    setHeart(likeButton, data, userId);
    likeButton.addEventListener('click', () => handleLikeClick(likeButton, data, userId));

    cardImage.addEventListener('click', () => handleOpenImage(cardImage.src, cardTitle.textContent));

    return cardElement;
}

function deleteCard(cardElement) {
    cardElement.remove();
}

function hasLike(data, userId) {
    return data.likes.some((like) => like._id === userId)
};

function setHeart(likeButton, data, userId) {
    if (hasLike(data, userId)) {
        likeButton.classList.add('card__like-button_is-active');
    } else {
        likeButton.classList.remove('card__like-button_is-active');
    }
}

function handleLikeClick(likeButton, data, userId) {
    const isLiked = hasLike(data, userId);
    toggleLike(data._id, isLiked ? "DELETE" : "PUT")
        .then((res) => {
            data.likes = res.likes
            setHeart(likeButton, data, userId);
            likeButton.dataset.like = data.likes.length;
        })
        .catch((err) => {
            console.log(`Ошибка при установке like: ${err}`)
        })
}

function showTrash(deleteButton, ownerId, userId) {
    if (ownerId === userId) {
        deleteButton.classList.remove('hide');
    }
}

export {createCard, deleteCard, handleLikeClick}