import '../pages/index.css';
import initialCards from "./components/cards";
import {closeModal, openModal, handleOpenImage} from "./components/modal";
import {createCard, deleteCard, handleLikeClick} from "./components/card";
import {enableValidation, clearValidation} from "./components/validation";

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

// @todo: Функция редактирования профиля
function handleEditProfile(nameValue, descriptionValue) {
    profileTitleElement.textContent = nameValue;
    profileDescriptionElement.textContent = descriptionValue;
}

// @todo: Функция применить изменения
function handleFormSubmit(evt) {
    evt.preventDefault();
    handleEditProfile(nameInput.value, descriptionInput.value);
    closeModal(popupEdit);
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

formElement.addEventListener('submit', handleFormSubmit);

addButton.addEventListener('click', function () { 
    openModal(popupNewCard);
    const formElement = popupNewCard.querySelector('.popup__form');
    clearValidation(formElement);
});

newPlaceForm.addEventListener('submit', addCard);

popupButtonEdit.addEventListener('click', function () {
    openModal(popupEdit);
    nameInput.value = profileTitleElement.textContent;
    descriptionInput.value = profileDescriptionElement.textContent;
    clearValidation(formElement);
});

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
enableValidation();