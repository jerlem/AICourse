document.addEventListener('DOMContentLoaded', () => {
    // Basic UI Elements
    const imageGrid = document.getElementById('image-grid');
    const resultSection = document.getElementById('result-section');
    const closeResultBtn = document.getElementById('close-result');
    const originalImg = document.getElementById('original-img');
    const maskImg = document.getElementById('mask-img');
    const runBtn = document.getElementById('run-segmentation');
    const overlay = document.getElementById('processing-overlay');
    const detectedItems = document.getElementById('detected-items');
    const processAllBtn = document.getElementById('process-all-btn');

    // Trends Elements
    const analyzeAllBtn = document.getElementById('analyze-all-btn');
    const trendsContent = document.getElementById('trends-content');

    let selectedImage = null;
    let trendsChart = null;

    // 1. Initial Load: Fetch Gallery
    fetchImages();

    async function fetchImages() {
        try {
            const response = await fetch('/api/images');
            const images = await response.json();

            if (images.error) throw new Error(images.error);

            imageGrid.innerHTML = '';
            images.forEach(imgName => {
                const div = document.createElement('div');
                div.className = 'image-item';
                div.innerHTML = `<img src="/imgs/${imgName}" alt="${imgName}">`;
                div.addEventListener('click', () => selectImage(imgName, div));
                imageGrid.appendChild(div);
            });
        } catch (error) {
            imageGrid.innerHTML = `<p class="error">Erreur: ${error.message}</p>`;
        }
    }

    // 2. Image Selection
    function selectImage(imgName, element) {
        document.querySelectorAll('.image-item').forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');

        selectedImage = imgName;
        originalImg.src = `/imgs/${imgName}`;
        maskImg.src = '';
        maskImg.classList.add('hidden');
        detectedItems.innerHTML = '';
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    closeResultBtn.addEventListener('click', () => {
        resultSection.classList.add('hidden');
        document.querySelectorAll('.image-item').forEach(item => item.classList.remove('selected'));
        selectedImage = null;
    });

    // 3. Single Image Segmentation
    runBtn.addEventListener('click', async () => {
        if (!selectedImage) return;

        runBtn.disabled = true;
        overlay.classList.remove('hidden');
        maskImg.classList.add('hidden');
        detectedItems.innerHTML = '<div class="loader-sm">Analyse des vêtements...</div>';

        try {
            const response = await fetch(`/api/process/${selectedImage}`);
            const data = await response.json();

            if (data.status === 'success') {
                maskImg.src = `/masks/${data.mask}?t=${Date.now()}`;
                maskImg.onload = () => {
                    maskImg.classList.remove('hidden');
                    overlay.classList.add('hidden');
                };

                // Render DETECTED LABELS
                if (data.labels && data.labels.length > 0) {
                    detectedItems.innerHTML = '<h3>Éléments détectés :</h3>';
                    const list = document.createElement('div');
                    list.className = 'label-chips';
                    data.labels.forEach(label => {
                        const chip = document.createElement('span');
                        chip.className = 'label-chip';
                        chip.textContent = translateLabel(label);
                        list.appendChild(chip);
                    });
                    detectedItems.appendChild(list);
                } else {
                    detectedItems.innerHTML = '<p class="info">Aucun vêtement spécifique détecté.</p>';
                }
            } else {
                alert(`Erreur: ${data.message}`);
                overlay.classList.add('hidden');
                detectedItems.innerHTML = '';
            }
        } catch (error) {
            alert(`Erreur réseau: ${error.message}`);
            overlay.classList.add('hidden');
            detectedItems.innerHTML = '';
        } finally {
            runBtn.disabled = false;
        }
    });

    // 4. Global Collection Trends
    analyzeAllBtn.addEventListener('click', async () => {
        analyzeAllBtn.disabled = true;
        analyzeAllBtn.textContent = 'Analyse de la collection...';

        try {
            const response = await fetch('/api/analyze-all');
            const data = await response.json();

            if (data.status === 'success') {
                renderTrendsChart(data.trends);
                trendsContent.classList.remove('hidden');
                trendsContent.scrollIntoView({ behavior: 'smooth' });
            } else {
                alert(`Erreur d'analyse : ${data.message}`);
            }
        } catch (error) {
            alert(`Erreur serveur : ${error.message}`);
        } finally {
            analyzeAllBtn.disabled = false;
            analyzeAllBtn.textContent = "Analyser toute la collection (15 images)";
        }
    });

    // 5. Batch Process (All images)
    processAllBtn.addEventListener('click', async () => {
        if (!confirm("Générer les masques pour TOUTE la collection ? Cela peut prendre plusieurs minutes.")) return;

        processAllBtn.disabled = true;
        processAllBtn.textContent = 'Traitement en cours...';

        try {
            const response = await fetch('/api/process/all');
            const data = await response.json();
            if (data.status === 'success') {
                alert(`Traitement terminé ! ${data.processed_count} images analysées.`);
            } else {
                alert(`Erreur : ${data.message}`);
            }
        } catch (error) {
            alert(`Erreur réseau : ${error.message}`);
        } finally {
            processAllBtn.disabled = false;
            processAllBtn.textContent = "Générer tous les masques";
        }
    });

    function translateLabel(label) {
        const trans = {
            'Hat': 'Chapeau', 'Hair': 'Cheveux', 'Sunglasses': 'Lunettes de soleil',
            'Upper-clothes': 'Vêtement Haut', 'Skirt': 'Jupe', 'Pants': 'Pantalon',
            'Dress': 'Robe', 'Belt': 'Ceinture', 'Left-shoe': 'Chaussure Gauche',
            'Right-shoe': 'Chaussure Droite', 'Face': 'Visage', 'Left-leg': 'Jambe Gauche',
            'Right-leg': 'Jambe Droite', 'Left-arm': 'Bras Gauche', 'Right-arm': 'Bras Droit',
            'Bag': 'Sac', 'Scarf': 'Écharpe'
        };
        return trans[label] || label;
    }

    function renderTrendsChart(trends) {
        const ctx = document.getElementById('trendsChart').getContext('2d');
        const labels = Object.keys(trends).map(translateLabel);
        const values = Object.values(trends);

        if (trendsChart) trendsChart.destroy();

        trendsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Occurrences',
                    data: values,
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                },
                plugins: { legend: { display: false } }
            }
        });
    }
});
