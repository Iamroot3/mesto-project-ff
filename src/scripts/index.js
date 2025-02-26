import '../pages/index.css';
import {closeModal, openModal, handleOpenImage, handleOpenConfirmation, renderLoading} from "./components/modal";
import {createCard, deleteCard, handleLikeClick} from "./components/card";
import {enableValidation, clearValidation} from "./components/validation";
import {setUserInfo, setAvatar} from "./components/UserInfo";
import { getInitialCards, getUserInfo, getAddCard, editUserInfo, getDeleteCard, toggleLike, changeAvatar } from '../scripts/components/Api';

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const newPlaceForm = document.querySelector('form[name="new-place"]');
const changeAvatarForm = document.querySelector('form[name="change-avatar"]');
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
const profileAvatar = document.querySelector('.profile__image');
const popupChangeAvatar = document.querySelector('.popup_change-avatar');
const userId = localStorage.getItem('userId');

// @todo: Функция применить изменения
function handleFormSubmit(evt) {
    const submitButton = popupEdit.querySelector('.popup__button');
    renderLoading(submitButton, true);
    evt.preventDefault();
    const nameValue = nameInput.value;
    const descriptionValue = descriptionInput.value;
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
            renderLoading(submitButton, false);
        })
}

function addCard(event) {
    const submitButton = newPlaceForm.querySelector('.popup__button');
    renderLoading(submitButton, true);
    event.preventDefault();

    const placeName = newPlaceForm.elements['place-name'].value;
    const placeLink = newPlaceForm.elements['link'].value;

    if (placeName && placeLink) {
        const newCardData = {
            name: placeName,
            link: placeLink
        };

        getAddCard(newCardData)
            .then((result) => {
                const newCard = createCard(result, handleOpenImage, userId);
                placesList.prepend(newCard);
                newPlaceForm.reset();
                closeModal(popupNewCard);
            })
            .catch((err) => {
                console.log(`Ошибка при добавлении карточки: ${err}`);
            })
            .finally(() => {
                renderLoading(submitButton, false);
            })
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

profileAvatar.addEventListener('click', function () {
    const avatarInput = changeAvatarForm.querySelector('.popup__input_type_url');;
    openModal(popupChangeAvatar);
    const changeButton = popupChangeAvatar.querySelector('.popup__button');
    avatarInput.value = "";
    clearValidation(formElement);
    
    changeButton.addEventListener('click', function() {
        renderLoading(changeButton, true);
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
                    renderLoading(changeButton, false);
                })
    });
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

function renderCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(cardData, handleOpenImage, userId);
        placesList.appendChild(card);
    });
}

getUserInfo()
    .then(info => {
        setUserInfo(info, profileTitleElement, profileDescriptionElement);
        setAvatar(info.avatar, profileAvatar);
        localStorage.setItem('userId', info._id);
    })
    .catch(error => {
        console.error('Ошибка профиля:', error);
    });

getInitialCards()
    .then(cards => {
        renderCards(cards);
    })
    .catch(error => {
        console.error('Ошибка при загрузке карточек:', error);
    });

enableValidation();

placesList.addEventListener('click', function(event) {
    if (event.target.classList.contains('card__delete-button')) {
        const cardElement = event.target.closest('.card');
        const cardId = cardElement.dataset.cardId;

        handleOpenConfirmation(() => {
            getDeleteCard(cardId)
                .then(() => {
                    deleteCard(cardElement);
                })
                .catch((err) => {
                    console.log(`Ошибка при удалении карточки: ${err}`)
                })
        });
    }
});