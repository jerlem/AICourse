import { renderWorks, fetchAndRenderWorks } from './works.js';
import { getToken } from './auth.js';

let modal = null;

export function initModal() {
    const editTrigger = document.getElementById('open-modal');
    if (editTrigger) {
        editTrigger.addEventListener('click', openModal);
    }

    document.querySelectorAll('.js-modal-close').forEach(a => {
        a.addEventListener('click', closeModal);
    });

    const addPhotoBtn = document.getElementById('add-photo-btn');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => {
            document.getElementById('modal-content').style.display = 'none';
            document.getElementById('modal-add-photo').style.display = 'block';
        });
    }

    const backBtn = document.querySelector('.js-modal-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('modal-content').style.display = 'block';
            document.getElementById('modal-add-photo').style.display = 'none';
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeModal(e);
        }
    });
}

function openModal(e) {
    e.preventDefault();
    modal = document.getElementById('modal');
    modal.style.display = 'flex';
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    renderModalGallery();
}

function closeModal(e) {
    if (modal === null) return;
    if (e) e.preventDefault();
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // Reset view
    document.getElementById('modal-content').style.display = 'block';
    document.getElementById('modal-add-photo').style.display = 'none';

    modal = null;
}

function stopPropagation(e) {
    e.stopPropagation();
}

async function renderModalGallery() {
    const galleryContainer = document.querySelector('.modal-gallery');
    galleryContainer.innerHTML = '';

    // Use local storage if available or fetch
    const response = await fetch('http://localhost:5678/api/works');
    const works = await response.json();

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const deleteBtn = document.createElement('button');

        img.src = work.imageUrl;
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteWork(work.id));

        figure.appendChild(img);
        figure.appendChild(deleteBtn);
        galleryContainer.appendChild(figure);
    });
}

async function deleteWork(id) {
    const token = getToken();
    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            renderModalGallery();
            fetchAndRenderWorks(); // Update main gallery
        } else {
            console.error('Erreur lors de la suppression');
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}
