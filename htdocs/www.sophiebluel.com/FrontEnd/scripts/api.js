/**
 * API Layer - Sophie Bluel Project
 * 
 * Ce fichier centralise toutes les requêtes vers l'API du backend.
 * Il utilise l'API 'fetch' de JavaScript qui repose sur les PROMISES.
 * 
 * --- COMPRENDRE LES PROMISES ET ASYNC/AWAIT ---
 * 
 * 1. Une PROMISE est un objet représentant la réussite ou l'échec d'une opération asynchrone (ex: un appel réseau).
 *    Elle a trois états possibles : 'pending' (en attente), 'fulfilled' (réussie), 'rejected' (échouée).
 * 
 * 2. Le mot-clé 'async' devant une fonction indique qu'elle retournera toujours une Promise.
 * 
 * 3. Le mot-clé 'await' (utilisé uniquement dans une fonction 'async') met en pause l'exécution
 *    de la fonction jusqu'à ce que la Promise soit résolue, permettant d'écrire du code asynchrone
 *    qui se lit comme du code synchrone.
 * 
 * 4. Gestion d'erreur : On utilise 'try/catch' pour intercepter les échecs de requêtes (rejections).
 */

const API_URL = 'http://localhost:5678/api';

/**
 * Récupère tous les travaux (works) depuis l'API.
 * @async
 * @returns {Promise<Array>} Un tableau d'objets représentants les travaux.
 * @throws {Error} Si la requête échoue.
 */
export async function getWorks() {
    const response = await fetch(`${API_URL}/works`);
    if (!response.ok) throw new Error('Failed to fetch works');
    return await response.json();
}

/**
 * Envoie un nouveau travail à l'API via un formulaire multipart.
 * @async
 * @param {FormData} formData - Les données du formulaire (image, titre, catégorie).
 * @param {string} token - Le token d'authentification JWT.
 * @returns {Promise<Object>} L'objet du travail créé.
 * @throws {Error} Si l'ajout échoue.
 */
export async function createWork(formData, token) {
    const response = await fetch(`${API_URL}/works`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });
    if (!response.ok) throw new Error('Failed to create work');
    return await response.json();
}

/**
 * Supprime un travail spécifique via son identifiant.
 * @async
 * @param {number} id - L'ID du travail à supprimer.
 * @param {string} token - Le token d'authentification JWT.
 * @returns {Promise<void>}
 * @throws {Error} Si la suppression échoue.
 */
export async function deleteWork(id, token) {
    const response = await fetch(`${API_URL}/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to delete work');
}

/**
 * Récupère toutes les catégories disponibles depuis l'API.
 * @async
 * @returns {Promise<Array>} Un tableau d'objets catégories.
 * @throws {Error} Si la récupération échoue.
 */
export async function getCategories() {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
}

/**
 * Crée une nouvelle catégorie (Admin).
 * @async
 * @param {string} name - Le nom de la catégorie.
 * @param {string} token - Le token d'authentification JWT.
 * @returns {Promise<Object>} La catégorie créée.
 * @throws {Error} Si la création échoue.
 */
export async function createCategory(name, token) {
    const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to create category');
    return await response.json();
}

/**
 * Met à jour le nom d'une catégorie existante (Admin).
 * @async
 * @param {number} id - L'ID de la catégorie.
 * @param {string} name - Le nouveau nom.
 * @param {string} token - Le token d'authentification JWT.
 * @returns {Promise<Object>} La catégorie mise à jour.
 * @throws {Error} Si la mise à jour échoue.
 */
export async function updateCategory(id, name, token) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error('Failed to update category');
    return await response.json();
}

/**
 * Supprime une catégorie (Admin).
 * @async
 * @param {number} id - L'ID de la catégorie.
 * @param {string} token - Le token d'authentification JWT.
 * @returns {Promise<void>}
 * @throws {Error} Si la suppression échoue.
 */
export async function deleteCategory(id, token) {
    const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to delete category');
}

/**
 * Authentifie l'utilisateur via son email et mot de passe.
 * @async
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} Objet contenant le userId et le token.
 * @throws {Error} Si l'authentification échoue.
 */
export async function login(email, password) {
    const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (!response.ok) throw new Error('Login failed');
    return await response.json();
}
