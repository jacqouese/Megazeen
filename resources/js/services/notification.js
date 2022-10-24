import { store } from 'react-notifications-component';
import httpCodeToMessage from '../helpers/httpCodeToMessage';

export function createNotification({ title, message, type }) {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeInDown'],
        animationOut: ['animate__animated', 'animate__fadeOutUp'],
        dismiss: {
            duration: 3000,
            onScreen: true,
        },
    });
}

export function createErrorNotification({ statusCode }) {
    const userMessage = httpCodeToMessage(statusCode);

    store.addNotification({
        title: userMessage.title,
        message: userMessage.message,
        type: userMessage.type,
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeInDown'],
        animationOut: ['animate__animated', 'animate__fadeOutUp'],
        dismiss: {
            duration: 3000,
            onScreen: true,
        },
    });
}
