import { renderWorks } from './works.js';
import { getToken } from './auth.js';
import { getCategories, createCategory as apiCreateCategory, updateCategory as apiUpdateCategory, deleteCategory as apiDeleteCategory } from './api.js';

let currentWorks = [];
let currentCategories = [];

/**
 * Récupère les catégories depuis l'API et lance le rendu des filtres
 * @param {Array} allWorks - Liste complète des travaux pour le filtrage
 */
export async function fetchAndRenderCategories(allWorks) {
    if (allWorks) currentWorks = allWorks;
    try {
        currentCategories = await getCategories();
        renderFilters();
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
}

/**
 * Met à jour la liste des travaux utilisée par les filtres
 * @param {Array} works - Nouvelle liste de travaux
 */
export function updateWorksForFilters(works) {
    currentWorks = works;
}

/**
 * Génère et affiche les boutons de filtre dans le DOM
 */
function renderFilters() {
    const filtersContainer = document.getElementById('filters');
    if (!filtersContainer) return;
    filtersContainer.innerHTML = '';

    // Bouton "Tous" pour afficher tous les projets
    const allBtn = createFilterButton('Tous', 0);
    allBtn.classList.add('active');
    filtersContainer.appendChild(allBtn);

    // Création d'un bouton pour chaque catégorie
    currentCategories.forEach(category => {
        const btn = createFilterButton(category.name, category.id);
        filtersContainer.appendChild(btn);
    });
}

/**
 * Crée un bouton de filtre avec son écouteur d'événement
 * @param {string} name - Nom de la catégorie
 * @param {number} id - ID de la catégorie (0 pour "Tous")
 * @returns {HTMLButtonElement} Le bouton créé
 */
function createFilterButton(name, id) {
    const button = document.createElement('button');
    button.textContent = name;
    button.classList.add('filter-btn');

    button.addEventListener('click', () => {
        // Mise à jour de l'état actif visuel
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filtrage des travaux selon la catégorie sélectionnée
        const filteredWorks = id === 0
            ? currentWorks
            : currentWorks.filter(work => work.categoryId === id);

        // Rendu de la galerie avec les travaux filtrés
        renderWorks(filteredWorks);
    });

    return button;
}

/**
 * Crée une nouvelle catégorie via l'API
 * @param {string} name - Nom de la nouvelle catégorie
 */
export async function createCategory(name) {
    const token = getToken();
    try {
        return await apiCreateCategory(name, token);
    } catch (error) {
        throw error;
    }
}

/**
 * Met à jour une catégorie via l'API
 * @param {number} id - ID de la catégorie
 * @param {string} name - Nouveau nom
 */
export async function updateCategory(id, name) {
    const token = getToken();
    try {
        return await apiUpdateCategory(id, name, token);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
    }
}

/**
 * Supprime une catégorie via l'API
 * @param {number} id - ID de la catégorie
 */
export async function deleteCategory(id) {
    const token = getToken();
    try {
        await apiDeleteCategory(id, token);
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        throw error;
    }
}
