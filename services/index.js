const baseUrl = 'https://hoodwink.medkomtek.net/api/'

export function post(url, body, token='') {
    const fetchUrl = baseUrl + url;
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    };
    return fetch(fetchUrl, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        return data;
    });
}
