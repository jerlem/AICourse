import { fetchAndRenderWorks } from './works.js';
import { fetchAndRenderCategories } from './categories.js';
import { isLoggedIn, logout } from './auth.js';
import { initModal } from './modal.js';
import { initUpload } from './upload.js';

/**
 * Fonction d'initialisation de l'application
 * Elle charge les travaux et configure l'interface selon l'état de connexion de l'utilisateur
 */
async function init() {
    // Récupération initiale de tous les travaux
    const works = await fetchAndRenderWorks();

    // Chargement et affichage des filtres par catégorie
    await fetchAndRenderCategories(works);

    if (isLoggedIn()) {
        // Mode Administrateur : configuration de l'interface d'édition
        document.body.classList.add('admin-mode');

        const loginLink = document.getElementById('login-link');
        loginLink.textContent = 'logout';
        loginLink.href = '#';

        // Gestion de la déconnexion
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });

        // Initialisation des fonctionnalités d'édition
        initModal();
        initUpload();
    }
}

// Lancement de l'application
init();
