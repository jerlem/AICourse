@echo off
echo Lancement du projet Sophie Bluel...
echo Verification des dependances...
if not exist "node_modules" (
    echo Installation des dependances racine...
    call npm install
)
if not exist "Backend\node_modules" (
    echo Installation des dependances Backend...
    cd Backend
    call npm install
    cd ..
)

echo Demarrage des serveurs...
start npm run dev
timeout /t 5
echo Ouverture du site...
start http://localhost:8080
echo Termine !
pause
