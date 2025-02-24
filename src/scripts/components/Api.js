const baseUrl = 'https://mesto.nomoreparties.co/v1/cohort-mag-4';

const headers = {
    authorization: '93c90859-501a-40fa-a2ac-1175f2406f19',
    'Content-Type': 'application/json'
};

function getResponseData(res) {
    if (!res.ok) {
        return Promise.reject(res.status);
    }
    return res.json();
}

export function getInitialCards() {
    return fetch(`${baseUrl}/cards`, { headers: headers })
        .then(res => getResponseData(res));
}

export function getUserInfo() {
    return fetch(`${baseUrl}/users/me`, { headers: headers })
        .then(res => getResponseData(res));
}

export function addCard(formData) {
    return fetch(`${baseUrl}/cards`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => getResponseData(res));
}

export function editUserInfo(formData) {
    return fetch(`${baseUrl}/users/me`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => getResponseData(res));
}

export function deleteCard(cardId) {
    return fetch(`${baseUrl}/cards/${cardId}`, {
        method: 'DELETE',
        headers: headers,
    })
    .then(res => getResponseData(res));
}

export function toggleLike(cardId, set) {
    return fetch(`${baseUrl}/cards/${cardId}/likes`, {
        method: set,
        headers: headers,
    })
    .then(res => getResponseData(res));
}

export function changeAvatar(formData) {
    return fetch(`${baseUrl}/users/me/avatar`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(formData)
    })
    .then(res => getResponseData(res));
}
