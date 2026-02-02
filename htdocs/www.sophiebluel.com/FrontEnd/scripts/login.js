import { login } from './api.js';

/**
 * Gestionnaire d'événement pour la soumission du formulaire de connexion
 */
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Récupération des valeurs des champs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-message');

    try {
        // Envoi de la requête de connexion à l'API
        const data = await login(email, password);

        // Succès : stockage du token et de l'ID utilisateur, puis redirection
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        window.location.href = 'index.html';
    } catch (error) {
        // Erreur réseau ou autre : affichage du message d'erreur et log
        console.error('Erreur lors de la connexion:', error);
        errorMsg.style.display = 'block';
    }
});
