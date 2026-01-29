import { renderWorks } from './works.js';
import { getToken } from './auth.js';

const API_URL = 'http://localhost:5678/api';
let currentWorks = [];
let currentCategories = [];

/**
 * Récupère les catégories depuis l'API et lance le rendu des filtres
 * @param {Array} allWorks - Liste complète des travaux pour le filtrage
 */
export async function fetchAndRenderCategories(allWorks) {
    if (allWorks) currentWorks = allWorks;
    try {
        const response = await fetch(`${API_URL}/categories`);
        currentCategories = await response.json();
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
        const response = await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        if (!response.ok) {
            throw new Error(`Failed to create category: ${response.status}`);
        }

        const result = await response.json();
        return result;
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
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });
        return await response.json();
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
        const response = await fetch(`${API_URL}/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        throw error;
    }
}
