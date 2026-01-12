import { fetchAndRenderWorks } from './works.js';
import { fetchAndRenderCategories } from './categories.js';
import { isLoggedIn, logout } from './auth.js';
import { initModal } from './modal.js';
import { initUpload } from './upload.js';

async function init() {
    const works = await fetchAndRenderWorks();

    if (isLoggedIn()) {
        document.body.classList.add('admin-mode');
        const loginLink = document.getElementById('login-link');
        loginLink.textContent = 'logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        initModal();
        initUpload();
    } else {
        await fetchAndRenderCategories(works);
    }
}

init();
