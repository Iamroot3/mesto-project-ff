import '../pages/index.css';
import initialCards from "./cards";
import {closeModal, openModal} from "./modal";


// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const newPlaceForm = document.querySelector('form[name="new-place"]');
const addButton = document.querySelector('.profile__add-button');
const closeButtons = document.querySelectorAll('.popup__close');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupEdit = document.querySelector('.popup_type_edit');
const popupButtonEdit = document.querySelector('.profile__edit-button');
const formElement = document.forms['edit-profile'];
const nameInput = formElement.elements.name;
const descriptionInput = formElement.elements.description;
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const popupImage = document.querySelector('.popup_type_image');
const imageElement = document.querySelector('.popup__image');
const captionElement = document.querySelector('.popup__caption');

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

function handleLikeClick(evt) {
    if (evt.target.classList.contains('card__like-button')) {
        evt.target.classList.toggle('card__like-button_is-active');
    }
}

// @todo: Функция добавления новой карточки
function addCard(event) {
    event.preventDefault();

    const placeName = newPlaceForm.elements['place-name'].value;
    const placeLink = newPlaceForm.elements['link'].value;

    if (placeName && placeLink) {
        const newCardData = {
            name: placeName,
            link: placeLink,
        };

        const newCard = createCard(newCardData, deleteCard, handleLikeClick, handleOpenImage);
        placesList.prepend(newCard);

        newPlaceForm.reset();
        closeModal(popupNewCard);
    }
}

function handleEditProfile(nameValue, descriptionValue) {
    profileTitleElement.textContent = nameValue;
    profileDescriptionElement.textContent = descriptionValue;
}

function handleFormSubmit(evt) {
    evt.preventDefault();
    handleEditProfile(nameInput.value, descriptionInput.value);
    closeModal(popupEdit);
}

formElement.addEventListener('submit', handleFormSubmit);

addButton.addEventListener('click', function () {
    openModal(popupNewCard);
});

newPlaceForm.addEventListener('submit', addCard);

popupButtonEdit.addEventListener('click', function () {
    openModal(popupEdit);
    nameInput.value = profileTitleElement.textContent;
    descriptionInput.value = profileDescriptionElement.textContent;
});

function handleOpenImage(imageLink, imageName) {

    imageElement.src = imageLink;
    imageElement.alt = imageName;

    captionElement.textContent = imageName;

    openModal(popupImage);
}

closeButtons.forEach(function (button)  {
    button.addEventListener('click', function () {
        const popupElement = button.closest('.popup');
        closeModal(popupElement);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.classList.add('popup_is-animated');
    });
});

// @todo: Вывести карточки на страницу
function renderCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(cardData, deleteCard, handleLikeClick, handleOpenImage);
        placesList.appendChild(card);
    });
}

renderCards(initialCards);
