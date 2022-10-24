const httpCodeToMessage = (httpCode) => {
    var message = {
        title: 'Coś poszło nie tak',
        message: 'Spróbój ponownie później',
        type: 'danger',
    };

    const numberHttpCode = Number(httpCode);

    if (numberHttpCode == 422) {
        message = {
            title: 'Uzupełnij pola',
            message: 'Upewnij się, że wszystkie pola są poprawnie wypełnione',
            type: 'danger',
        };
    }

    if (numberHttpCode == 404) {
        message = {
            title: 'Produkt niedostępny',
            message: 'Wybrany produkt nie jest dostępny',
            type: 'warning',
        };
    }

    return message;
};

export default httpCodeToMessage;
