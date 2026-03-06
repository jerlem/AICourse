@echo off
echo Lancement du serveur Fashion Trend Intelligence...
echo Le serveur sera disponible sur : http://localhost:5000

:: Verifier l'existence de l'environnement virtuel
if not exist ".venv\Scripts\activate.bat" (
    echo Erreur : Environnement virtuel Introuvable ^(.venv^)
    pause
    exit /b
)

:: Ouvrir le navigateur par defaut apres un court delai
start "" "http://localhost:5000"

:: Activer l'environnement virtuel et lancer l'application
call .venv\Scripts\activate.bat
python web/app.py

pause
