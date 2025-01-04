import '../pages/index.css';
import initialCards from "./cards";

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
const newPlaceForm = document.querySelector('form[name="new-place"]');
const addButton = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');

// @todo: Функция создания карточки
function createCard(data, handleDelete) {
    const cardElement = cardTemplate.cloneNode(true).querySelector('.card');
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');

    cardImage.src = data.link;
    cardImage.alt = data.name;
    cardTitle.textContent = data.name;

    deleteButton.addEventListener('click', () => {
        handleDelete(cardElement);
    });

    return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
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

        const newCard = createCard(newCardData, deleteCard);
        placesList.prepend(newCard);

        newPlaceForm.reset();
        closePopup();
    }
}

function openPopup() {
    popupNewCard.classList.add('popup_is-opened');
    const closeButton = popupNewCard.querySelector('.popup__close');
    closeButton.addEventListener('click', closePopup);
}

function closePopup() {
    const popup = document.querySelector('.popup_is-opened');
    if (popup) {
        popup.classList.remove('popup_is-opened');
    }
}

addButton.addEventListener('click', openPopup);
newPlaceForm.addEventListener('submit', addCard);

// @todo: Вывести карточки на страницу
function renderCards(cards) {
    cards.forEach(cardData => {
        const card = createCard(cardData, deleteCard);
        placesList.appendChild(card);
    });
}

renderCards(initialCards);
