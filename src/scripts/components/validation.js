const formElement = document.querySelector('.popup__form');
const formInput = formElement.querySelector('.popup__input');

const clearValidation = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
    inputElement.setCustomValidity('');
  });

  toggleButtonState(inputList, buttonElement);
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add('popup__form-error');
  } else {
    console.warn(`Элемент для отображения ошибки с селектором .${inputElement.name}-error не найден`);
  }
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (errorElement) {
    errorElement.classList.remove('popup__form-error');
    errorElement.textContent = '';
  } else {
    console.warn(`Элемент для отображения ошибки с селектором .${inputElement.name}-error не найден`);
  }
};

const checkRegexValidity = (inputElement) => {
  if (inputElement.type === 'text') {
    const regex = /^[a-zA-Zа-яА-Я\s-]+$/;
    return regex.test(inputElement.value);
  }
  return true;
};

const isValid = (formElement, inputElement) => {
  let errorMessage = '';

  if (inputElement.required && !inputElement.value) {
    errorMessage = inputElement.validationMessage; 
  } else {
    if (inputElement.type === 'text' && !checkRegexValidity(inputElement)) {
      errorMessage = inputElement.dataset.message || "Разрешены только латинские и кириллические буквы, знаки дефиса и пробелы.";
    }
  }

  if (errorMessage) {
    inputElement.setCustomValidity(errorMessage);
  } else {
    inputElement.setCustomValidity('');
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');
  toggleButtonState(inputList, buttonElement);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
}; 

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button_disabled');
  } else {
        buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button_disabled');
  }
}; 

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll('.popup__form'));

  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

export {enableValidation, clearValidation}