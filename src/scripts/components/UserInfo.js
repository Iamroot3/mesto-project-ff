export function getUserInfo() {
    return { 
        name: nameElement.textContent, 
        about: aboutElement.textContent 
    };
}

export function setUserInfo(formData, name, about) {
    name.textContent = formData.name;
    about.textContent = formData.about;
}

export function setAvatar(urlAvatar, avatarElement) {
    avatarElement.style.backgroundImage = `url(${urlAvatar})`;
}