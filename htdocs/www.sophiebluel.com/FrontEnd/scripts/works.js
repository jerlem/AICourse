const API_URL = 'http://localhost:5678/api';

export async function fetchAndRenderWorks() {
    try {
        const response = await fetch(`${API_URL}/works`);
        const works = await response.json();
        renderWorks(works);
        return works;
    } catch (error) {
        console.error('Erreur lors de la récupération des travaux:', error);
    }
}

export function renderWorks(works) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    });
}
