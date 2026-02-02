import { getToken } from './auth.js';
import { fetchAndRenderWorks } from './works.js';
import { createWork, getCategories } from './api.js';

/**
 * Initialise les fonctionnalités d'upload de projet
 */
export async function initUpload() {
    const form = document.getElementById('add-photo-form');
    const fileInput = document.getElementById('file-upload');
    const imagePreview = document.getElementById('image-preview');

    // Chargement initial des catégories
    await updateCategorySelect();

    // Gestion de la prévisualisation de l'image sélectionnée
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                // Masque les éléments par défaut du conteneur d'upload
                document.querySelector('.upload-container i').style.display = 'none';
                document.querySelector('.upload-label').style.display = 'none';
                document.querySelector('.upload-container p').style.display = 'none';
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        }
    });

    // Écoute des changements sur tous les champs pour valider le formulaire en temps réel
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });

    /**
     * Gestionnaire de soumission du formulaire d'ajout de projet
     */
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Création de l'objet FormData pour l'envoi multipart
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', document.getElementById('photo-title').value);
        formData.append('category', document.getElementById('photo-category').value);

        const token = getToken();

        try {
            await createWork(formData, token);

            // Succès : réinitialisation du formulaire et de l'interface
            form.reset();
            imagePreview.style.display = 'none';
            document.querySelector('.upload-container i').style.display = 'block';
            document.querySelector('.upload-label').style.display = 'block';
            document.querySelector('.upload-container p').style.display = 'block';

            // Retour à la vue galerie de la modale
            const backBtn = document.querySelector('.js-modal-back');
            backBtn.click();

            // Rafraîchissement des galeries (principale)
            fetchAndRenderWorks();
        } catch (error) {
            console.error('Erreur lors de l\'ajout du projet:', error);
        }
    });
}

/**
 * Met à jour le sélecteur de catégories dans le formulaire d'ajout
 */
export async function updateCategorySelect() {
    const categorySelect = document.getElementById('photo-category');
    if (!categorySelect) return;

    try {
        const categories = await getCategories();

        categorySelect.innerHTML = '<option value=""></option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des catégories:', error);
    }
}

/**
 * Vérifie si tous les champs requis sont remplis pour activer le bouton de validation
 */
function checkFormValidity() {
    const fileInput = document.getElementById('file-upload');
    const titleInput = document.getElementById('photo-title');
    const categorySelect = document.getElementById('photo-category');
    const submitBtn = document.getElementById('submit-photo');

    if (fileInput.files.length > 0 && titleInput.value.trim() !== '' && categorySelect.value !== '') {
        submitBtn.classList.add('valid');
    } else {
        submitBtn.classList.remove('valid');
    }
}
