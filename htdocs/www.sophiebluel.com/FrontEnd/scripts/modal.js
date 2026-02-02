import { renderWorks, fetchAndRenderWorks } from './works.js';
import { getToken } from './auth.js';
import { createCategory, updateCategory, deleteCategory, fetchAndRenderCategories } from './categories.js';
import { updateCategorySelect } from './upload.js';
import { getWorks, getCategories, deleteWork as apiDeleteWork } from './api.js';

let activeModal = null;

/**
 * Initialise les événements liés aux modales
 */
export function initModal() {
    // Bouton pour ouvrir la modale principale (projets)
    const editTrigger = document.getElementById('open-modal');
    if (editTrigger) {
        editTrigger.addEventListener('click', (e) => openModal(e, 'modal'));
    }

    // Bouton pour ouvrir la modale des catégories
    const manageCategoriesBarBtn = document.getElementById('manage-categories-bar-btn');
    if (manageCategoriesBarBtn) {
        manageCategoriesBarBtn.addEventListener('click', (e) => openModal(e, 'modal-categories'));
    }

    // Boutons pour fermer les modales
    document.querySelectorAll('.js-modal-close').forEach(a => {
        a.addEventListener('click', closeModal);
    });

    // Basculer vers la vue d'ajout de photo
    const addPhotoBtn = document.getElementById('add-photo-btn');
    if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => {
            document.getElementById('modal-content').style.display = 'none';
            document.getElementById('modal-add-photo').style.display = 'block';
        });
    }

    // Retourner vers la vue galerie de la modale (depuis ajout photo)
    const backBtn = document.querySelector('.js-modal-back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('modal-content').style.display = 'block';
            document.getElementById('modal-add-photo').style.display = 'none';
        });
    }

    // Formulaire d'ajout de catégorie
    const addCategoryForm = document.getElementById('add-category-form');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('new-category-name');
            const name = nameInput.value.trim();
            if (name) {
                await createCategory(name);
                nameInput.value = '';
                await renderCategoriesAdmin();
                await updateCategorySelect();

                // Rafraîchir les filtres de la page principale
                const works = await fetchAndRenderWorks();
                await fetchAndRenderCategories(works);
            }
        });
    }

    // Fermeture de la modale avec la touche Échap
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeModal(e);
        }
    });
}

/**
 * Ouvre une modale spécifique et initialise son contenu
 * @param {Event} e - L'événement de clic
 * @param {string} modalId - L'ID de la modale à ouvrir
 */
function openModal(e, modalId) {
    e.preventDefault();
    activeModal = document.getElementById(modalId);
    activeModal.style.display = 'flex';
    activeModal.removeAttribute('aria-hidden');
    activeModal.setAttribute('aria-modal', 'true');
    activeModal.addEventListener('click', closeModal);
    activeModal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    if (modalId === 'modal') {
        renderModalGallery();
    } else if (modalId === 'modal-categories') {
        renderCategoriesAdmin();
    }
}

/**
 * Ferme la modale active et réinitialise son état interne
 * @param {Event} e - L'événement de clic ou null
 */
function closeModal(e) {
    if (activeModal === null) return;
    if (e) e.preventDefault();
    activeModal.style.display = 'none';
    activeModal.setAttribute('aria-hidden', 'true');
    activeModal.removeAttribute('aria-modal');
    activeModal.removeEventListener('click', closeModal);
    activeModal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // Réinitialisation des vues internes
    if (activeModal.id === 'modal') {
        document.getElementById('modal-content').style.display = 'block';
        document.getElementById('modal-add-photo').style.display = 'none';
        fetchAndRenderWorks(); // Refresh main gallery if works were changed
    }

    activeModal = null;
}

/**
 * Empêche la propagation du clic vers les éléments parents
 */
function stopPropagation(e) {
    e.stopPropagation();
}

/**
 * Récupère les travaux et les affiche dans la galerie de la modale
 */
async function renderModalGallery() {
    const galleryContainer = document.querySelector('.modal-gallery');
    if (!galleryContainer) return;
    galleryContainer.innerHTML = '';

    try {
        const works = await getWorks();

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
    } catch (error) {
        console.error('Erreur lors du rendu de la galerie de la modale:', error);
    }
}

/**
 * Affiche la liste des catégories pour la gestion (admin)
 */
async function renderCategoriesAdmin() {
    const listContainer = document.getElementById('categories-admin-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    try {
        const categories = await getCategories();

        categories.forEach(category => {
            const li = document.createElement('li');
            li.textContent = category.name;

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'cat-actions';

            // Bouton Edit
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
            editBtn.addEventListener('click', async () => {
                const newName = prompt('Nouveau nom pour la catégorie :', category.name);
                if (newName && newName.trim() !== '' && newName !== category.name) {
                    await updateCategory(category.id, newName.trim());
                    await renderCategoriesAdmin();
                    await updateCategorySelect();

                    // Rafraîchir les filtres de la page principale
                    const works = await fetchAndRenderWorks();
                    await fetchAndRenderCategories(works);
                }
            });

            // Bouton Delete
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteBtn.className = 'delete-cat';
            deleteBtn.addEventListener('click', async () => {
                if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
                    try {
                        await deleteCategory(category.id);
                        await renderCategoriesAdmin();
                        await updateCategorySelect();

                        // Rafraîchir les filtres de la page principale
                        const works = await fetchAndRenderWorks();
                        await fetchAndRenderCategories(works);
                    } catch (err) {
                        alert('Erreur : Impossible de supprimer une catégorie liée à des travaux.');
                    }
                }
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            li.appendChild(actionsDiv);
            listContainer.appendChild(li);
        });
    } catch (error) {
        console.error('Erreur lors du rendu des catégories admin:', error);
    }
}

/**
 * Supprime un travail via l'API
 */
async function deleteWork(id) {
    const token = getToken();
    if (!token) return;

    if (!confirm('Voulez-vous vraiment supprimer ce projet ?')) return;

    try {
        await apiDeleteWork(id, token);
        await renderModalGallery();
        await fetchAndRenderWorks();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}
