/**
 * Vérifie si l'utilisateur est connecté en vérifiant la présence d'un token dans le localStorage
 * @returns {boolean} true si l'utilisateur est connecté, sinon false
 */
export function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

/**
 * Récupère le token d'authentification depuis le localStorage
 * @returns {string|null} Le token ou null s'il n'existe pas
 */
export function getToken() {
    return localStorage.getItem('token');
}

/**
 * Déconnecte l'utilisateur en supprimant les données du localStorage et redirige vers l'accueil
 */
export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}
