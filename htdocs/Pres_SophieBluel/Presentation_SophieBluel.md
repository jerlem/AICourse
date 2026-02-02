# Présentation de Fin de Projet : Portfolio Sophie Bluel
**Durée estimée : 10 minutes**

---

## 1. Introduction (1 min)
*   **Contexte** : Développement du portfolio de Sophie Bluel, architecte d'intérieur.
*   **Objectif** : Transformer un site statique en une application web dynamique avec un espace d'administration.
*   **Stack Technique** :
    *   **Frontend** : HTML5, CSS3, JavaScript (Vanilla).
    *   **Backend** : Node.js (fourni) avec API REST.
    *   **Outils** : Swagger pour la documentation API.

## 2. Récupération Dynamique des Données (2 min)
*   **Défi** : Passer d'un contenu codé en dur à une gestion dynamique via l'API.
*   **Réalisation** :
    *   Utilisation de `fetch` pour récupérer les travaux (`/works`) et les catégories (`/categories`).
    *   Création d'une fonction `renderWorks` pour générer le DOM dynamiquement.
*   **Point clé** : Gestion des erreurs asynchrones pour garantir que le site reste fonctionnel même en cas de problème serveur.

## 3. Système de Filtrage (2 min)
*   **Exigence** : Trier les projets par catégorie sans recharger la page.
*   **Approche** :
    *   Génération automatique des boutons de filtres basés sur les données de l'API.
    *   Utilisation de tableaux JavaScript (`filter()`) pour mettre à jour la galerie en temps réel.
*   **UX** : Feedback visuel sur le bouton actif pour une navigation intuitive.

## 4. Espace Administrateur et Authentification (2 min)
*   **Login** : Mise en place d'un formulaire de connexion avec validation des identifiants via l'API.
*   **Gestion du State** :
    *   Stockage sécurisé du Token JWT dans le `sessionStorage`.
    *   Modification dynamique de l'interface : apparition de la barre "Mode Édition" et des boutons de modification.
    *   Gestion de la déconnexion (`logout`).

## 5. Gestion des Projets : Modale et Suppression (2 min)
*   **Modale** : Conception d'une fenêtre modale multi-vues.
*   **Suppression** :
    *   Affichage d'une galerie miniature dans la modale.
    *   Appels API `DELETE` sécurisés par le token d'authentification.
    *   Mise à jour instantanée du DOM (galerie principale et modale) après suppression.

## 6. Ajout de Travaux et Conclusion (1 min)
*   **Formulaire d'ajout** :
    *   Upload d'image avec prévisualisation.
    *   Envoi des données via `FormData` pour gérer le format multipart.
*   **Conclusion** : 
    *   Le projet répond à toutes les exigences fonctionnelles.
    *   Code structuré en modules JS pour une maintenance facilitée.
    *   Expérience utilisateur fluide et interface fidèle aux maquettes.

---

### Guide pour l'oral :
*   *Min 0-1* : Saluer et poser le décor (Le besoin de Sophie).
*   *Min 1-3* : Expliquer comment les données arrivent sur le site (La magie du `fetch`).
*   *Min 3-5* : Montrer la partie "Public" (Filtres).
*   *Min 5-8* : Basculer côté "Admin" (Authentification + Modale).
*   *Min 9-10* : Récapituler les points forts (Sécurité, Performance, Fidélité au design).
