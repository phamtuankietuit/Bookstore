export const getLocalStorage = () => {
    const object = window.localStorage.getItem('object');

    return JSON.parse(object);
}

export const isLogin = () => {
    return window.localStorage.getItem('isLogin');
}