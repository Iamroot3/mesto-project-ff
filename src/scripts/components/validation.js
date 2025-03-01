const showInputError = (formElement, inputElement, errorMessage, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (errorElement) {
    errorElement.textContent = errorMessage;
    errorElement.classList.add(settings.errorClass);
  } else {
    console.warn(`Элемент для отображения ошибки с селектором .${inputElement.name}-error не найден`);
  }
};

const hideInputError = (formElement, inputElement, settings) => {
  const errorElement = formElement.querySelector(`.${inputElement.name}-error`);
  if (errorElement) {
    errorElement.classList.remove(settings.errorClass);
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

const isValid = (formElement, inputElement, settings) => {
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
    showInputError(formElement, inputElement, inputElement.validationMessage, settings);
  } else {
    hideInputError(formElement, inputElement, settings);
  }
};

const setEventListeners = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, settings);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      isValid(formElement, inputElement, settings);
      toggleButtonState(inputList, buttonElement, settings);
    });
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, settings) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(settings.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(settings.inactiveButtonClass);
  }
};

const enableValidation = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));

  formList.forEach((formElement) => {
    setEventListeners(formElement, settings);
  });
};

const clearValidation = (formElement, settings) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, settings);
    inputElement.setCustomValidity('');
  });

  toggleButtonState(inputList, buttonElement, settings);
};

export { enableValidation, clearValidation };