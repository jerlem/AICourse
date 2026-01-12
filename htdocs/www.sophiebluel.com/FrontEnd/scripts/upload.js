import { getToken } from './auth.js';
import { fetchAndRenderWorks } from './works.js';

export async function initUpload() {
    const form = document.getElementById('add-photo-form');
    const fileInput = document.getElementById('file-upload');
    const imagePreview = document.getElementById('image-preview');
    const categorySelect = document.getElementById('photo-category');

    // Load categories for select
    const catResponse = await fetch('http://localhost:5678/api/categories');
    const categories = await catResponse.json();

    categorySelect.innerHTML = '<option value=""></option>';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });

    // Image preview
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                document.querySelector('.upload-container i').style.display = 'none';
                document.querySelector('.upload-label').style.display = 'none';
                document.querySelector('.upload-container p').style.display = 'none';
                checkFormValidity();
            };
            reader.readAsDataURL(file);
        }
    });

    // Form validity
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', checkFormValidity);
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', document.getElementById('photo-title').value);
        formData.append('category', document.getElementById('photo-category').value);

        const token = getToken();

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                // Success
                form.reset();
                imagePreview.style.display = 'none';
                document.querySelector('.upload-container i').style.display = 'block';
                document.querySelector('.upload-label').style.display = 'block';
                document.querySelector('.upload-container p').style.display = 'block';

                // Close modal or return to gallery
                const backBtn = document.querySelector('.js-modal-back');
                backBtn.click();

                // Refresh galleries
                fetchAndRenderWorks();
            } else {
                console.error('Erreur lors de l\'ajout du projet');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du projet:', error);
        }
    });
}

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
