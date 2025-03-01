import '../pages/index.css';
import {closeModal, openModal, renderLoading} from "./components/modal";
import {createCard, deleteCard} from "./components/card";
import {enableValidation, clearValidation} from "./components/validation";
import {setUserInfo, setAvatar} from "./components/UserInfo";
import {getInitialCards, getUserInfo, getAddCard, editUserInfo, getDeleteCard, changeAvatar} from '../scripts/components/Api';

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupEdit = document.querySelector('.popup_type_edit');
const popupButtonEdit = document.querySelector('.profile__edit-button');
const popupChangeAvatar = document.querySelector('.popup_change-avatar');
const popupImage = document.querySelector('.popup_type_image');
const popupWithConfirmation = document.querySelector('.popup_confirmation');

const newPlaceForm = document.querySelector('form[name="new-place"]');
const changeAvatarForm = document.querySelector('form[name="change-avatar"]');
const changeAvatarButton = popupChangeAvatar.querySelector('.popup__button');

const profileForm = document.querySelector('form[name="edit-profile"]');
const profileTitleElement = document.querySelector('.profile__title');
const profileDescriptionElement = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const profileNameInput = profileForm.elements.name;
const profileDescriptionInput = profileForm.elements.description;

const newPlaceAddButton = document.querySelector('.profile__add-button');
const profileSubmitButton = popupEdit.querySelector('.popup__button');
const closeButtons = document.querySelectorAll('.popup__close');
const newPlaceButton = newPlaceForm.querySelector('.popup__button');
const deleteConfirmButton = popupWithConfirmation.querySelector('.button__confirmation');

const avatarInput = changeAvatarForm.querySelector('.popup__input_type_url');
const imageElement = popupImage.querySelector('.popup__image');
const userId = localStorage.getItem('userId');

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__form-error'
};

let currentCardToDelete = null;

function handleOpenImage(imageLink, imageName) {
    const captionElement = document.querySelector('.popup__caption');

    imageElement.src = imageLink;
    imageElement.alt = imageName;
    captionElement.textContent = imageName;

    openModal(popupImage);
}

function handleOpenConfirmation(cardElement, cardId) {
    currentCardToDelete = { element: cardElement, id: cardId };
    openModal(popupWithConfirmation);
}

function profileFormSubmit(evt) {
    renderLoading(profileSubmitButton, true);
    evt.preventDefault();
    const nameValue = profileNameInput.value;
    const descriptionValue = profileDescriptionInput.value;
    const formData = { name: nameValue, about: descriptionValue };
    editUserInfo(formData)
        .then((result) => {
            setUserInfo(result, profileTitleElement, profileDescriptionElement);
            closeModal(popupEdit);
        })
        .catch((err) => {
            console.log(`Ьмиси: ${err}`);
        })
        .finally(() => {
            renderLoading(profileSubmitButton, false);
        })
}

function addCard(event) {
    const placeName = newPlaceForm.elements['place-name'].value;
    const placeLink = newPlaceForm.elements['link'].value;
    renderLoading(newPlaceButton, true);
    event.preventDefault();

    if (placeName && placeLink) {
        const newCardData = {
            name: placeName,
            link: placeLink
        };

        getAddCard(newCardData)
            .then((result) => {
                const newCard = createCard(result, handleOpenImage, userId, handleOpenConfirmation, deleteCard, getDeleteCard);
                placesList.prepend(newCard);
                newPlaceForm.reset();
                console.log('newCard', newCard);
                closeModal(popupNewCard);
            })
            .catch((err) => {
                console.log(`Ошибка при добавлении карточки: ${err}`);
            })
            .finally(() => {
                renderLoading(newPlaceButton, false);
            })
    }
}

profileForm.addEventListener('submit', profileFormSubmit);

newPlaceAddButton.addEventListener('click', function () { 
    openModal(popupNewCard);
    clearValidation(newPlaceForm, validationConfig);
});

newPlaceForm.addEventListener('submit', addCard);

popupButtonEdit.addEventListener('click', function () {
    openModal(popupEdit);
    profileNameInput.value = profileTitleElement.textContent;
    profileDescriptionInput.value = profileDescriptionElement.textContent;
    clearValidation(profileForm, validationConfig);
});

profileAvatar.addEventListener('click', function () {
    openModal(popupChangeAvatar);
    avatarInput.value = "";
    clearValidation(changeAvatarForm, validationConfig);
    
    changeAvatarButton.addEventListener('click', function() {
        renderLoading(changeAvatarButton, true);
        const avatarUrl = {avatar: avatarInput.value};
        changeAvatar(avatarUrl)
                .then(() => {
                    setAvatar(avatarInput.value, profileAvatar);
                    closeModal(popupChangeAvatar);
                })
                .catch((err) => {
                    console.log(`Ошибка при смене аватара: ${err}`)
                })
                .finally(() => {
                    renderLoading(changeAvatarButton, false);
                })
    });
});

closeButtons.forEach(function (button)  {
    button.addEventListener('click', function () {
        const popupElement = button.closest('.popup');
        closeModal(popupElement);
    });
});

deleteConfirmButton.addEventListener('click', function () {
    if (currentCardToDelete) {
        const { element, id } = currentCardToDelete;
        getDeleteCard(id)
            .then(() => {
                deleteCard(element);
                closeModal(popupWithConfirmation);
                currentCardToDelete = null;
            })
            .catch((err) => {
                console.log(`Ошибка при удалении карточки: ${err}`);
            });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => {
        popup.classList.add('popup_is-animated');
    });
});

function renderCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(cardData, handleOpenImage, userId, handleOpenConfirmation, deleteCard, getDeleteCard);
        placesList.appendChild(card);
    });
}

Promise.all([getUserInfo(), getInitialCards()])
    .then(([userInfo, cards]) => {
        setUserInfo(userInfo, profileTitleElement, profileDescriptionElement);
        setAvatar(userInfo.avatar, profileAvatar);
        localStorage.setItem('userId', userInfo._id);

        renderCards(cards);
    })
    .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
    });

enableValidation(validationConfig);