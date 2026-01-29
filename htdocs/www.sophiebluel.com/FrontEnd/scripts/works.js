import { updateWorksForFilters } from './categories.js';

const API_URL = 'http://localhost:5678/api';

/**
 * Récupère les travaux depuis l'API et les affiche dans la galerie principale
 * @returns {Promise<Array>} La liste des travaux récupérés
 */
export async function fetchAndRenderWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);
        const works = await response.json();
        renderWorks(works);
        updateWorksForFilters(works); // Mise à jour de la liste pour les filtres
        return works;
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
    }
}

/**
 * Génère le HTML pour chaque travail et l'insère dans la galerie
 * @param {Array} works - Liste des travaux à afficher
 */
export function renderWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = ''; // Vide la galerie avant d'ajouter les nouveaux éléments

    works.forEach(work => {
        // Création des éléments HTML pour chaque projet
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        // Assemblage et ajout au DOM
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
