const API_URL = 'http://localhost:5678/api';

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
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            // Succès : stockage du token et de l'ID utilisateur, puis redirection
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            window.location.href = 'index.html';
        } else {
            // Échec : affichage du message d'erreur
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        // Erreur réseau ou autre : affichage du message d'erreur et log
        console.error('Erreur lors de la connexion:', error);
        errorMsg.style.display = 'block';
    }
});
