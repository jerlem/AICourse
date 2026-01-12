import { renderWorks } from './works.js';

const API_URL = 'http://localhost:5678/api';

export async function fetchAndRenderCategories(allWorks) {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        renderFilters(categories, allWorks);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
    }
}

function renderFilters(categories, allWorks) {
    const filtersContainer = document.getElementById('filters');
    filtersContainer.innerHTML = '';

    // Bouton "Tous"
    const allBtn = createFilterButton('Tous', 0, allWorks);
    allBtn.classList.add('active');
    filtersContainer.appendChild(allBtn);

    categories.forEach(category => {
        const btn = createFilterButton(category.name, category.id, allWorks);
        filtersContainer.appendChild(btn);
    });
}

function createFilterButton(name, id, allWorks) {
    const button = document.createElement('button');
    button.textContent = name;
    button.classList.add('filter-btn');

    button.addEventListener('click', () => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter works
        const filteredWorks = id === 0
            ? allWorks
            : allWorks.filter(work => work.categoryId === id);

        renderWorks(filteredWorks);
    });

    return button;
}
