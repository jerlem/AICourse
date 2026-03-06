Write-Host "Lancement du serveur Fashion Trend Intelligence..." -ForegroundColor Cyan
Write-Host "Le serveur sera disponible sur : http://localhost:5000" -ForegroundColor Green

# Ensure we are in the right directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Run the flask app
python web/app.py
